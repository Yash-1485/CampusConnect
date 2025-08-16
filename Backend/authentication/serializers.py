# serializers.py
from rest_framework import serializers
from django.http import QueryDict
import json
from django.contrib.auth import authenticate
from django.core.validators import validate_email
from .models import User

class SignupSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(
        required=True,
        error_messages={
            "required": "Full name is required",
            "blank": "Full name cannot be blank"
        }
    )
    
    email = serializers.EmailField(
        required=True,
        error_messages={
            'required': 'Email is required',
            'invalid': 'Invalid email address',
            'blank': 'Email cannot be blank'
        }
    )
    
    password = serializers.CharField(
        required=True,
        write_only=True, 
        min_length=8,
        error_messages = {
            "required": "Password is required",
            "min_length": "Password should be at least 8 characters long"
        }
    )
    
    phone = serializers.CharField(
        required=True,
        max_length=10,
        min_length=10,
        error_messages={
            "required": "Phone number is required",
            "max_length": "Phone number should be 10 digits long",
            "min_length": "Phone number should be 10 digits long",
            "invalid": "Invalid phone number format",
            "blank": "Phone number cannot be blank"
        }
    )

    role = serializers.ChoiceField(
        choices=User.ROLE_CHOICES,
        required=True,
        error_messages={
            "required": "Role is required",
            "invalid_choice": "Invalid role. Choose 'user' or 'admin'."
        }
    )

    class Meta:
        model = User
        fields = ["email", "password", "full_name", "phone", "role"]

    # To check if email already exists before creating a new user 
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists", code="email_exists")
        return value
    
    def validate_phone(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Phone number must contain digits only")
        return value

    # To create a new user with validated data 
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data["email"], password=data["password"])
        if not user:
            raise serializers.ValidationError("Invalid email or password")
        data["user"] = user
        return data

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # exclude = ["password"]
        fields = [
            "id", "full_name", "email", "profileImage", "role", "phone", "is_verified", "dob", "gender", "city", "district", "state", "pincode",
            "affiliation_type", "affiliation_name", "preferred_city", "preferred_district", "preferred_state", "preferred_pincode", 
            "budget", "preferred_categories", "preferred_amenities", "preferred_locations", "sharing_preference", "created_at", "updated_at"
        ]
    
    def get_profileImage(self, obj):
        request = self.context.get('request')
        if obj.profileImage and hasattr(obj.profileImage, 'url'):
            return request.build_absolute_uri(obj.profileImage.url)
        return None

class UpdateProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(
    # source="full_name",
        required=True,
        allow_blank=False,
        error_messages={
            "required": "Full name is required",
            "blank": "Full name cannot be blank"
        }
    )
    
    phone = serializers.CharField(
        required=True,
        max_length=10,
        min_length=10,
        error_messages={
            "required": "Phone number is required",
            "max_length": "Phone number should be 10 digits long",
            "min_length": "Phone number should be 10 digits long",
            "invalid": "Invalid phone number format",
            "blank": "Phone number cannot be blank"
        }
    )
    
    preferred_categories = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )
    preferred_amenities = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )
    preferred_locations = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )

    def to_internal_value(self, data):
        # Handle QueryDict for form data
        if isinstance(data, QueryDict):
            data = data.copy()
            processed_data = {}
            
            # Handle preferred_locations
            if 'preferred_locations' in data:
                locations = data.getlist('preferred_locations')
                try:
                    # If single JSON string was sent
                    if len(locations) == 1 and locations[0].startswith('['):
                        processed_data['preferred_locations'] = json.loads(locations[0])
                    else:
                        # If multiple form values were sent
                        processed_data['preferred_locations'] = locations
                except json.JSONDecodeError:
                    processed_data['preferred_locations'] = []
            
            # Handle other fields
            for key, value in data.items():
                if key not in processed_data:
                    if key in ['preferred_categories', 'preferred_amenities']:
                        processed_data[key] = data.getlist(key)
                    else:
                        processed_data[key] = value
            
            return super().to_internal_value(processed_data)
        
        return super().to_internal_value(data)
    
    class Meta:
        model = User
        fields = [
            "full_name", "phone", "dob", "gender", "profileImage",
            "city", "district", "state", "pincode",
            "affiliation_type", "affiliation_name", "preferred_city", "preferred_district", "preferred_state", "preferred_pincode",
            "preferred_categories", "preferred_amenities",
            "preferred_locations", "budget", "sharing_preference"
        ]
        extra_kwargs = {field: {"required": False} for field in fields}
    
    def validate_phone(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Phone number must contain digits only")
        return value
    
    # This part is added later for is_verified field
    def validate(self, data):
        user = self.instance  # instance is the current user being updated
        required_fields = self.Meta.fields

        if not user.is_verified:
            missing_fields = [field for field in required_fields if field not in data and not getattr(user, field)]
            if missing_fields:
                raise serializers.ValidationError({
                    field: f"{field.replace('_', ' ').capitalize()} is required"
                    for field in missing_fields
                })
        return data

    def update(self, instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)

        # ✅ If user was unverified, and now has all fields, verify them
        if not instance.is_verified:
            all_filled = all(getattr(instance, field) for field in self.Meta.fields if field != "profileImage")
            if all_filled:
                instance.is_verified = True

        instance.save()
        return instance

class UpdateUserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(
        required=False,
        allow_blank=True,
        error_messages={
            "blank": "Full name cannot be blank"
        }
    )
    
    phone = serializers.CharField(
        required=False,
        max_length=10,
        min_length=10,
        error_messages={
            "max_length": "Phone number should be 10 digits long",
            "min_length": "Phone number should be 10 digits long",
            "invalid": "Invalid phone number format",
            "blank": "Phone number cannot be blank"
        }
    )
    
    email = serializers.EmailField(
        required=False,
        allow_blank=True,
        error_messages={
            "invalid": "Enter a valid email address",
            "blank": "Email cannot be blank"
        }
    )
    class Meta:
        model = User
        fields = [
            "full_name", "phone","email", "dob", "gender", "profileImage",
            "city", "district", "state", "pincode",
            "affiliation_type", "affiliation_name", "preferred_city", "preferred_district", "preferred_state", "preferred_pincode",
            "preferred_categories", "preferred_amenities",
            "preferred_locations", "budget", "sharing_preference"
        ]
        extra_kwargs = {field: {"required": False} for field in fields}

    def validate_phone(self, value):
        if value and not value.isdigit():
            raise serializers.ValidationError("Phone number must contain digits only")
        return value

    def update(self, instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)

        # Verify user if all required fields are filled
        if not instance.is_verified:
            all_filled = all(getattr(instance, field) for field in self.Meta.fields if field != "profileImage")
            if all_filled:
                instance.is_verified = True

        instance.save()
        return instance
    
class AdminUserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "full_name", "email", "role", "is_verified"]
