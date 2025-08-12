from rest_framework import serializers
from .models import Bookmark
from listings.models import Listing

class BookmarkSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    listing = serializers.PrimaryKeyRelatedField(queryset=Listing.objects.filter(is_active=True))

    class Meta:
        model = Bookmark
        fields = ['id', 'user', 'listing', 'created_at']
        read_only_fields = ['id', 'user', 'listing', 'created_at']

    def validate(self, attrs):
        user = self.context['request'].user
        listing = attrs.get('listing')

        if listing.created_by == user or user.role=="admin":
            raise serializers.ValidationError("You are not allowed to bookmark listings.")

        if Bookmark.objects.filter(user=user, listing=listing).exists():
            raise serializers.ValidationError("You have already bookmarked this listing.")

        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        listing = validated_data['listing']
        bookmark, created = Bookmark.objects.get_or_create(user=user, listing=listing)
        return bookmark