from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User
from django.utils.html import format_html

@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    model = User
    list_display = ("email", "full_name", "role", "is_verified", "preferred_city", "preferred_state", "get_preferred_categories", "profile_preview")
    search_fields = ("email", "full_name", "phone", "preferred_city", "preferred_state")
    list_filter = ("role", "is_verified", "preferred_state", "preferred_city")
    
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("full_name", "phone", "dob", "gender", "profileImage", "city", "district", "state", "pincode")}),
        ("Preferred Location", {"fields": ("preferred_city", "preferred_state", "preferred_district", "preferred_pincode")}),
        ("Affiliation", {"fields": ("affiliation_type", "affiliation_name")}),
        ("Preferences", {"fields": ("budget", "preferred_categories", "sharing_preference", "preferred_amenities", "preferred_locations")}),
        ("Permissions", {"fields": ("role", "is_active", "is_staff", "is_superuser", "is_verified")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "full_name", "phone", "preferred_city", "preferred_state", "password"),
        }),
    )
    
    def profile_preview(self, obj):
        if obj.profileImage:
            return format_html('<img src="{}" width="50" height="50" style="border-radius: 50%;" />', obj.profileImage.url)
        return "-"
    profile_preview.short_description = 'Profile Image'
    
    def get_preferred_categories(self, obj):
        if obj.preferred_categories:
            if '[]' in obj.preferred_categories:
                return "-"
            if isinstance(obj.preferred_categories, str):
                categories = obj.preferred_categories.split(",")
            else:
                categories = obj.preferred_categories
            return ", ".join(categories)
        return "-"

    ordering = ("email",)
