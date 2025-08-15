# serializers.py
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
import requests, cloudinary
from rest_framework import serializers
from django.core.validators import MinValueValidator, validate_email
from .models import Listing, ListingImage
from django.utils.translation import gettext_lazy as _

MAX_IMAGE_SIZE_MB = 3
MAX_IMAGE_COUNT = 5
class ListingImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = ListingImage
        fields = ['id','image','image_url']
        extra_kwargs = {
            'image': {
                'required': True,
                'error_messages': {
                    'required': 'At least one image is required',
                    'invalid': 'Invalid image file',
                    'blank': 'Image cannot be blank'
                }
            }
        }
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None
    
    def validate_image(self, value):
        if not value:
            raise serializers.ValidationError("Image is required.")
        if hasattr(value, 'size') and value.size == 0:
            raise serializers.ValidationError("Uploaded image is empty.")
        return value

class ListingSerializer(serializers.ModelSerializer):
    images = ListingImageSerializer(many=True, required=True)
    
    title = serializers.CharField(
        required=True,
        max_length=200,
        error_messages={
            'required': 'Title is required',
            'max_length': 'Title cannot exceed 200 characters',
            'blank': 'Title cannot be blank'
        }
    )
    
    description = serializers.CharField(
        required=True,
        error_messages={
            'required': 'Description is required',
            'blank': 'Description cannot be blank'
        }
    )
    
    category = serializers.ChoiceField(
        choices=Listing.CATEGORY_CHOICES,
        required=True,
        error_messages={
            'required': 'Category is required',
            'invalid_choice': 'Invalid category. Choose from: PG, Hostel, Mess, Tiffin Service, Tutor'
        }
    )
    
    provider_name = serializers.CharField(
        required=True,
        max_length=100,
        error_messages={
            'required': 'Provider name is required',
            'max_length': 'Provider name cannot exceed 100 characters',
            'blank': 'Provider name cannot be blank'
        }
    )
    
    provider_phone = serializers.CharField(
        required=True,
        max_length=10,
        min_length=10,
        error_messages={
            'required': 'Provider phone is required',
            'max_length': 'Phone number should be maximum 10 digits',
            'min_length': 'Phone number should be at least 10 digits',
            'blank': 'Phone number cannot be blank'
        }
    )
    
    provider_email = serializers.EmailField(
        required=True,
        error_messages={
            'required': 'Provider email is required',
            'invalid': 'Invalid email address',
            'blank': 'Email cannot be blank'
        }
    )
    
    address = serializers.CharField(
        required=True,
        max_length=255,
        error_messages={
            'required': 'Address is required',
            'max_length': 'Address cannot exceed 255 characters',
            'blank': 'Address cannot be blank'
        }
    )
    
    price = serializers.DecimalField(
        required=True,
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        error_messages={
            'required': 'Price is required',
            'invalid': 'Invalid price format',
            'max_digits': 'Price cannot exceed 10 digits',
            # 'max_decimal_places': 'Price can have maximum 2 decimal places',
            'min_value': 'Price cannot be negative'
        }
    )
    
    city = serializers.CharField(
        required=True,
        max_length=100,
        error_messages={
            'required': 'City is required',
            'max_length': 'City name cannot exceed 100 characters',
            'blank': 'City cannot be blank'
        }
    )
    
    state = serializers.CharField(
        required=True,
        max_length=100,
        error_messages={
            'required': 'State is required',
            'max_length': 'State name cannot exceed 100 characters',
            'blank': 'State cannot be blank'
        }
    )
    
    amenities = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list,
        error_messages={
            'invalid': 'Amenities must be a list of strings'
        }
    )
    
    room_type = serializers.ChoiceField(
        choices=Listing.ROOM_TYPE_CHOICES,
        required=True,
        allow_null=True,
        error_messages={
            'invalid_choice': f"Invalid room type. Choose from: {', '.join([choice[1] for choice in Listing.ROOM_TYPE_CHOICES])}"
        }
    )
    
    occupancy_limit = serializers.IntegerField(
        required=False,
        allow_null=True,
        min_value=1,
        error_messages={
            'min_value': 'Occupancy limit must be at least 1',
            'invalid': 'Invalid occupancy number'
        }
    )
    
    gender_preference = serializers.ChoiceField(
        choices=Listing.GENDER_CHOICES,
        required=True,
        allow_null=True,
        error_messages={
            'invalid_choice': f"Invalid gender preference. Choose from: {', '.join([choice[1] for choice in Listing.GENDER_CHOICES])}"
        }
    )
    
    food_included = serializers.BooleanField(required=False,default=False)    
    is_furnished = serializers.BooleanField(required=False,default=False)
    availability = serializers.BooleanField(required=False,default=True)

    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'description', 'category', 'provider_name', 
            'provider_phone', 'provider_email', 'address', 'price', 
            'city', 'state', 'district', 'pincode',
            'amenities', 'room_type', 'occupancy_limit', 'gender_preference',
            'food_included', 'is_furnished', 'availability', 'images', 'is_active', 
            'rating',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_active']
    
    def validate_provider_phone(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Phone number must contain digits only")
        return value
    
    def validate_provider_email(self, value):
        try:
            validate_email(value)
        except:
            raise serializers.ValidationError("Invalid email address format")
        return value
    
    def validate_amenities(self, value):
        valid_amenities = Listing.AMENITY_CHOICES
        for amenity in value:
            if amenity not in valid_amenities:
                raise serializers.ValidationError(
                    f"'{amenity}' is not a valid amenity. Valid options are: {', '.join(valid_amenities)}"
                )
        return value
    
    def validate_pincode(self,value):
        if not value.isdigit():
            raise serializers.ValidationError("Pincode contains digits only")
        if len(value)!=6:
            raise serializers.ValidationError("Pincode must be 6 digits long")
    
    # def validate_room_type(self, value):
    #     if value and self.initial_data.get('category') == 'tutor' and value != 'single':
    #         raise serializers.ValidationError("Tutor listings can only have single room type")
    #     return value

    def validate_occupancy_limit(self, value):
        room_type = self.initial_data.get('room_type')
        if value and room_type:
            if room_type == 'single' and value > 1:
                raise serializers.ValidationError("Single room cannot have occupancy > 1")
            if room_type == 'double' and value > 2:
                raise serializers.ValidationError("Double sharing cannot have occupancy > 2")
            if room_type == 'triple' and value > 3:
                raise serializers.ValidationError("Triple sharing cannot have occupancy > 3")
            if room_type == 'quad' and value > 4:
                raise serializers.ValidationError("Quad sharing cannot have occupancy > 4")
        return value

    def validate_title(self, value):
        """
        Validate that the title is unique for the same address
        """
        request = self.context.get('request')
        
        # Only check for duplicates during creation (POST requests)
        if request and request.method == 'POST':
            address = self.initial_data.get('address')
            
            if address and Listing.objects.filter(
                title__iexact=value,  # Case-insensitive match
                address__iexact=address
            ).exists():
                raise serializers.ValidationError(
                    "A listing with this title and address already exists",
                    code="duplicate_listing"
                )
        return value
    
    # Validate listings images
    def validate_images(self, value):
        if len(value) > MAX_IMAGE_COUNT:
            raise serializers.ValidationError(f"Maximum {MAX_IMAGE_COUNT} images are allowed.")

        for image in value:
            if image.size > MAX_IMAGE_SIZE_MB * 1024 * 1024:
                raise serializers.ValidationError(f"Each image must be smaller than {MAX_IMAGE_SIZE_MB}MB.")
        return value
    
    def validate(self, data):
        # Validate at least one image is provided
        if 'images' not in data or len(data['images']) == 0:
            raise serializers.ValidationError({
                'images': 'At least one image is required'
            })
        
        images_data = data.get('images')
        if not images_data:
            raise serializers.ValidationError({'images': 'At least one image is required.'})
        for img in images_data:
            if not img.get('image'):
                raise serializers.ValidationError({'images': 'Empty or invalid image provided.'})
        return data
    
    def create(self, validated_data):
        images_data = validated_data.pop('images')
        listing = Listing.objects.create(**validated_data)
        
        for image_data in images_data:
            ListingImage.objects.create(listing=listing, **image_data)
            
        return listing
    
    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', None)
        
        # Update listing fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update images if provided
        if images_data is not None:
            # Clear existing images and add new ones
            instance.images.all().delete()
            for image_data in images_data:
                ListingImage.objects.create(listing=instance, **image_data)                
        return instance

class UpdateListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = ['image']
        extra_kwargs = {'image': {'required': False, 'allow_null': True}}

class UpdateListingSerializer(serializers.ModelSerializer):
    images = UpdateListingImageSerializer(many=True, required=False)
    
    room_type = serializers.ChoiceField(
        choices=Listing.ROOM_TYPE_CHOICES,
        required=False,
        allow_null=True
    )
    
    occupancy_limit = serializers.IntegerField(
        required=False,
        allow_null=True,
        min_value=1
    )
    
    class Meta:
        model = Listing
        exclude = ['created_by', 'updated_at', 'rating', 'review_count']
        extra_kwargs = {field: {'required': False} for field in [
            'title', 'description', 'category', 'provider_name', 'provider_phone',
            'provider_email', 'address', 'price', 'city', 'state', 'district', 'pincode',
            'amenities', 'availability', 'is_active','created_at'
        ]}
    
    def validate(self, data):
        # Room Type validation
        if 'room_type' in data or 'occupancy_limit' in data:
            room_type = data.get('room_type', self.instance.room_type if self.instance else None)
            occupancy = data.get('occupancy_limit', self.instance.occupancy_limit if self.instance else None)
            
            if room_type == 'single' and occupancy and occupancy > 1:
                raise serializers.ValidationError({
                    'occupancy_limit': 'Single room cannot have occupancy > 1'
                })
                
            if room_type == 'double' and occupancy and occupancy > 2:
                raise serializers.ValidationError({
                    'occupancy_limit': 'Double sharing cannot have occupancy > 2'
                })
            
            if room_type == 'triple' and occupancy and occupancy > 3:
                raise serializers.ValidationError({
                    'occupancy_limit': 'Triple sharing cannot have occupancy > 3'
                })
            
            if room_type == 'quad' and occupancy and occupancy > 4:
                raise serializers.ValidationError({
                    'occupancy_limit': 'Quad sharing cannot have occupancy > 4'
                })
            
        # Image validation
        if 'images' in data and data['images'] is not None:
            if len(data['images']) > 10:
                raise serializers.ValidationError({'images': 'Maximum 10 images allowed'})
            if any(not img.get('image') for img in data['images']):
                raise serializers.ValidationError({'images': 'Empty image data provided'})
        
        return data
    
    def validate_provider_phone(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Phone number must contain digits only")
        if len(value)!=10:raise serializers.ValidationError("Phone number must be 10 digit long")
        return value
        
    def validate_provider_email(self, value):
        try:
            validate_email(value)
        except:
            raise serializers.ValidationError("Invalid email address format")
        return value
    
    def validate_pincode(self,value):
        if not value.isdigit():
            raise serializers.ValidationError("Pincode contains digits only")
        if len(value)!=6:
            raise serializers.ValidationError("Pincode must be 6 digits long")
    
    def update(self, instance, validated_data):
        if 'images' in validated_data:
            instance.images.all().delete()
            for img_data in validated_data.pop('images', []):
                ListingImage.objects.create(listing=instance, **img_data)
        
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        return instance