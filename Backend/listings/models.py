from django.db import models
from django.conf import settings
from cloudinary.models import CloudinaryField
from .validator import validate_image_type_and_size

class Listing(models.Model):
    CATEGORY_CHOICES = (
        ("pg", "PG"),
        ("hostel", "Hostel"),
        ("mess", "Mess"),
        ("tiffin", "Tiffin Service"),
        ("tutor", "Tutor"),
    )

    AMENITY_CHOICES = [
        "WiFi", "Air Conditioning", "Laundry", "Attached Bathroom",
        "Meals Included", "Housekeeping", "Parking", "CCTV",
        "Study Table", "Wardrobe", "24x7 Water", "Security Guard",
        "Power Backup", "Refrigerator", "TV", "Geyser"
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
    location_city = models.CharField(max_length=100)
    location_state = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()

    amenities = models.JSONField(default=list)
    availability = models.BooleanField(default=True)

    rating = models.FloatField(default=0)
    review_count = models.PositiveIntegerField(default=0)

    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
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
