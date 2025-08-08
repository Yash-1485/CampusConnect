from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User
from django.utils.html import format_html

@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    model = User
    # list_display = ("email", "full_name", "role", "is_verified", "location_city", "location_state", "created_at", "is_staff")
    list_display = ("email", "full_name", "role", "is_verified", "location_city", "location_state", "created_at", "profile_preview")
    search_fields = ("email", "full_name", "phone", "location_city", "location_state")
    list_filter = ("role", "is_verified", "location_state", "location_city")
    
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("full_name", "phone", "dob", "gender", "profileImage")}),
        ("Location", {"fields": ("location_city", "location_state")}),
        ("Preferences", {"fields": (
            "budget", "preferred_categories", "sharing_preference",
            "preferred_amenities", "preferred_locations"
        )}),
        ("Permissions", {"fields": ("role", "is_active", "is_staff", "is_superuser", "is_verified")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "full_name", "phone", "location_city", "location_state", "password"),
        }),
    )
    
    def profile_preview(self, obj):
        if obj.profileImage:
            return format_html('<img src="{}" width="50" height="50" style="border-radius: 50%;" />', obj.profileImage.url)
        return "-"
    profile_preview.short_description = 'Profile Image'

    ordering = ("email",)
