from django.db import models
from multiselectfield import MultiSelectField
from django.conf import settings
from django.utils import timezone
from cloudinary.models import CloudinaryField
from .validator import validate_image_type_and_size, validate_created_by

class Listing(models.Model):
    CATEGORY_CHOICES = (
        ("pg", "PG"),
        ("hostel", "Hostel"),
        ("mess", "Mess"),
        ("tiffin", "Tiffin Service"),
        ("tutor", "Tutor"),
    )
    
    ROOM_TYPE_CHOICES = [
        ("single", "Single Room"),
        ("double", "Double Sharing"),
        ("triple", "Triple Sharing"),
        ("quad", "Four Sharing"),
        ("dorm", "Dormitory"),
    ]

    GENDER_CHOICES = [
        ("male", "Male Only"),
        ("female", "Female Only"),
        ("any", "Any Gender"),
    ]

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

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)

    # Provider contact details (could be the admin or an external provider)
    provider_name = models.CharField(max_length=100)
    provider_phone = models.CharField(max_length=15)
    provider_email = models.EmailField()
    
    address = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    # Geo + city/state for coarse search
    district = models.CharField(max_length=100, null=True, blank=True)
    pincode = models.CharField(max_length=6, null=True, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    
    room_type = models.CharField(max_length=20, choices=ROOM_TYPE_CHOICES, blank=True, null=True)
    occupancy_limit = models.PositiveIntegerField(blank=True, null=True)
    gender_preference = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, null=True)
    food_included = models.BooleanField(default=False)
    is_furnished = models.BooleanField(default=False)
    amenities = MultiSelectField(choices=AMENITY_CHOICES, max_length=255, blank=True)
    availability = models.BooleanField(default=True)

    rating = models.FloatField(default=0)
    review_count = models.PositiveIntegerField(default=0)

    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, validators=[validate_created_by])
    # created_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} ({self.category})"


class ListingImage(models.Model):
    listing = models.ForeignKey(Listing, related_name='images', on_delete=models.CASCADE)
    # To upload images on cloud
    # image = CloudinaryField('image',folder="CampusConnect/Listings")
    image = models.ImageField(upload_to="listings/",validators=[validate_image_type_and_size])
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.listing.title}"
