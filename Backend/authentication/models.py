from django.db import models
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

    username=None
    full_name=models.CharField(max_length=100, null=True, blank=True)
    email = models.EmailField(unique=True)
    profileImage = models.ImageField(upload_to="profileImages/", null=True, blank=True,default="profileImages/default.png",validators=[validate_image_type_and_size])
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="student")
    phone = models.CharField(max_length=15)
    is_verified = models.BooleanField(default=False)

    # Personal info
    dob = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, null=True, blank=True)

    # Basic location info (coarse)
    location_city = models.CharField(max_length=100)
    location_state = models.CharField(max_length=100)

    # Preferences
    budget = models.PositiveIntegerField(null=True, blank=True)
    preferred_categories = models.JSONField(default=list)
    sharing_preference = models.CharField(
        max_length=20,
        choices=[("private", "Private Room"), ("shared", "Shared Room"), ("any", "Any")],
        default="any"
    )
    preferred_amenities = models.JSONField(default=list)
    preferred_locations = models.JSONField(default=list)
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    # REQUIRED_FIELDS = [
    #     "email",
    #     "phone",
    #     "location_city",
    #     "location_state",
    # ]
    
    objects = CustomUserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name","phone", "location_city", "location_state"]

    def __str__(self):
        return f"{self.username} ({self.role})"
