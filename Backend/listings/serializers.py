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
    class Meta:
        model = ListingImage
        fields = ['image']
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
    
    location_city = serializers.CharField(
        required=True,
        max_length=100,
        error_messages={
            'required': 'City is required',
            'max_length': 'City name cannot exceed 100 characters',
            'blank': 'City cannot be blank'
        }
    )
    
    location_state = serializers.CharField(
        required=True,
        max_length=100,
        error_messages={
            'required': 'State is required',
            'max_length': 'State name cannot exceed 100 characters',
            'blank': 'State cannot be blank'
        }
    )
    
    latitude = serializers.FloatField(
        required=True,
        error_messages={
            'required': 'Latitude is required',
            'invalid': 'Invalid latitude value'
        }
    )
    
    longitude = serializers.FloatField(
        required=True,
        error_messages={
            'required': 'Longitude is required',
            'invalid': 'Invalid longitude value'
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
    
    availability = serializers.BooleanField(
        required=False,
        default=True
    )

    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'description', 'category', 'provider_name', 
            'provider_phone', 'provider_email', 'address', 'price', 
            'location_city', 'location_state', 'latitude', 'longitude', 
            'amenities', 'availability', 'images', 'is_active', 
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

    def validate_latitude(self, value):
        """
        Validate latitude and check for nearby existing listings
        """
        longitude = self.initial_data.get('longitude')
        
        if longitude:
            # Check for existing listings within 0.001 degrees (~100 meters)
            nearby_exists = Listing.objects.filter(
                latitude__range=(value-0.001, value+0.001),
                longitude__range=(longitude-0.001, longitude+0.001)
            ).exists()
            
            if nearby_exists and self.context.get('request').method == 'POST':
                raise serializers.ValidationError(
                    "A listing already exists at or very near this location",
                    code="duplicate_location"
                )
        return value

    def validate_longitude(self, value):
        """
        Validate longitude is within valid range
        """
        if not (-180 <= value <= 180):
            raise serializers.ValidationError(
                "Longitude must be between -180 and 180 degrees",
                code="invalid_longitude"
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
        # Validate latitude range (-90 to 90)
        if not (-90 <= data['latitude'] <= 90):
            raise serializers.ValidationError({
                'latitude': 'Latitude must be between -90 and 90 degrees'
            })
        
        # Validate longitude range (-180 to 180)
        if not (-180 <= data['longitude'] <= 180):
            raise serializers.ValidationError({
                'longitude': 'Longitude must be between -180 and 180 degrees'
            })
        
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
        
        if ('latitude' in data) ^ ('longitude' in data):  # XOR check
            raise serializers.ValidationError({
                'non_field_errors': ['Both latitude and longitude must be provided together']
            })
        
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