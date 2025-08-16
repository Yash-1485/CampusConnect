from rest_framework import serializers
from authentication.serializers import UserSerializer
from listings.serializers import ListingSerializer
from authentication.models import User
from listings.models import Listing
from django.core.validators import MinValueValidator, MaxValueValidator
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)     
    listing = ListingSerializer(read_only=True)
    rating = serializers.IntegerField(required=True,validators=[MinValueValidator(1), MaxValueValidator(10)],
        error_messages={
            'required': 'Rating is required',
            'min_value': 'Rating must be at least 1',
            'max_value': 'Rating cannot be more than 10'
        }
    )
    
    comment = serializers.CharField(
        required=True,
        error_messages={
            'required': 'Comment is required',
            'blank': 'Comment cannot be blank',
        }
    )
    
    class Meta:
        model = Review
        fields = ["id", "user", "listing", "rating", "comment", "is_approved", "created_at"]
        read_only_fields = ["id", "is_approved", "created_at"]

    def validate_rating(self, value):
        if not (1.0 <= value <= 5.0):
            raise serializers.ValidationError("Rating must be between 1.0 and 5.0.")
        return value

    def validate_comment(self, value):
        if not value.strip():
            raise serializers.ValidationError("Comment cannot be empty.")
        if value.isdigit():
            raise serializers.ValidationError("Comment cannot contain only digits.")
        if len(value)<4:
            raise serializers.ValidationError("Minimum review length is 4.")
        return value

    def validate(self, data):
        user = self.context['request'].user
        listing = data.get('listing')
        if self.instance is None:  # Create
            if Review.objects.filter(user=user, listing=listing).exists():
                raise serializers.ValidationError("You have already reviewed this listing.")
        return data


class ReviewUpdateSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    listing = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Review
        fields = ["user", "listing","rating", "comment","is_approved","created_at"]

    def validate_rating(self, value):
        if not (1 <= value <= 5):
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

    def validate_comment(self, value):
        if not value.strip():
            raise serializers.ValidationError("Comment cannot be empty.")
        return value

    def validate(self, data):
        user = self.context['request'].user
        listing = data.get('listing')
        if self.instance is None:  # Create
            if not Review.objects.filter(user=user, listing=listing).exists():
                raise serializers.ValidationError("You have not reviewed this listing.")
        if not data.get("rating") and not data.get("comment"):
            raise serializers.ValidationError("Provide at least a rating or a comment to update.")
        return data

class AdminReviewApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["is_approved"]

    def update(self, instance, validated_data):
        instance.is_approved = validated_data.get("is_approved", instance.is_approved)
        instance.save()
        return instance
