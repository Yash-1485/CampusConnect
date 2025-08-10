from django.db import models
from multiselectfield import MultiSelectField
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from .managers import CustomUserManager
from .validator import validate_image_type_and_size

# Create your models here.
class User(AbstractUser):
    """Custom user model supporting users(students, adults) and admins."""

    ROLE_CHOICES = (
        ("user", "User"),
        ("admin", "Admin"),
    )

    GENDER_CHOICES = (
        ("male", "Male"),
        ("female", "Female"),
        ("other", "Other"),
    )
    
    CATEGORY_CHOICES = (
        ("pg", "PG"),
        ("hostel", "Hostel"),
        ("mess", "Mess"),
        ("tiffin", "Tiffin Service"),
        ("tutor", "Tutor"),
    )
    
    AMENITY_CHOICES = [
        ("wifi", "WiFi"),
        ("ac", "Air Conditioning"),
        ("laundry", "Laundry"),
        ("attached_bathroom", "Attached Bathroom"),
        ("meals", "Meals Included"),
        ("housekeeping", "Housekeeping"),
        ("parking", "Parking"),
        ("cctv", "CCTV"),
        ("study_table", "Study Table"),
        ("wardrobe", "Wardrobe"),
        ("water", "24x7 Water"),
        ("security", "Security Guard"),
        ("power_backup", "Power Backup"),
        ("fridge", "Refrigerator"),
        ("tv", "TV"),
        ("geyser", "Geyser"),
    ]

    username=None
    full_name=models.CharField(max_length=100, null=True, blank=True)
    email = models.EmailField(unique=True)
    profileImage = models.ImageField(upload_to="profileImages/", null=True, blank=True,default="profileImages/default.png",validators=[validate_image_type_and_size])
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="user")
    phone = models.CharField(max_length=15)
    is_verified = models.BooleanField(default=False)

    # Personal info
    dob = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, null=True, blank=True)

    # Basic location info (coarse)
    # User's Current Location
    city = models.CharField(max_length=100)
    district = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10, null=True, blank=True)

    # User's Preffered Location
    affiliation_type = models.CharField(max_length=20, choices=[("institution", "Institution"), ("organization", "Organization")], null=True, blank=True)
    affiliation_name = models.CharField(max_length=255, null=True, blank=True)

    preferred_city = models.CharField(max_length=100)
    preferred_district = models.CharField(max_length=100, null=True, blank=True)
    preferred_state = models.CharField(max_length=100)
    preferred_pincode = models.CharField(max_length=10, null=True, blank=True)

    # Preferences
    budget = models.PositiveIntegerField(null=True, blank=True)
    preferred_categories = MultiSelectField(choices=CATEGORY_CHOICES)
    sharing_preference = models.CharField(
        max_length=20,
        choices=[("private", "Private Room"), ("shared", "Shared Room"), ("any", "Any")],
        default="any"
    )
    # preferred_amenities = models.JSONField(default=list)
    preferred_amenities = MultiSelectField(choices=AMENITY_CHOICES, blank=True, null=True)
    preferred_locations = models.JSONField(default=list, blank=True, null=True)
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = CustomUserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name","phone", "city", "state"]

    def __str__(self):
        return f"{self.full_name.split(" ")[0]} ({self.role})"
