from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator, MinLengthValidator
from django.core.exceptions import ValidationError
from authentication.models import User
from listings.models import Listing


def validate_not_only_digits(value):
    if value.isdigit():
        raise ValidationError("Comment cannot contain only digits.")

class Review(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="reviews",help_text="The user who wrote the review.")
    listing = models.ForeignKey(Listing,on_delete=models.CASCADE,related_name="reviews",help_text="The listing this review belongs to.")
    rating = models.DecimalField(max_digits=2, decimal_places=1, validators=[MinValueValidator(1.0),MaxValueValidator(5.0)],help_text="Rating between 1 (worst) and 5 (best).")
    comment = models.TextField(help_text="Optional comment for the review.",validators=[MinLengthValidator(4,message="Comment must be at least 4 characters."),validate_not_only_digits])
    is_approved = models.BooleanField(default=False,help_text="Whether this review has been approved by admin/moderator.")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        unique_together = ("user", "listing")
        indexes = [
            models.Index(fields=["listing"]),
            models.Index(fields=["-created_at"]),
        ]
        verbose_name = "Review"
        verbose_name_plural = "Reviews"

    def __str__(self):
        return f"{self.rating}★ by {self.user.username} on {self.listing.title}"
