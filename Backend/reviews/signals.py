from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Review

@receiver(post_save, sender=Review)
def update_review_count_on_save(sender, instance, created, **kwargs):
    listing = instance.listing
    count = listing.reviews.count()
    listing.review_count = count
    listing.save(update_fields=['review_count'])

@receiver(post_delete, sender=Review)
def update_review_count_on_delete(sender, instance, **kwargs):
    listing = instance.listing
    count = listing.reviews.count()
    listing.review_count = count
    listing.save(update_fields=['review_count'])

# For make rating avg
# from django.db.models import Avg

# @receiver(post_save, sender=Review)
# @receiver(post_delete, sender=Review)
# def update_review_stats(sender, instance, **kwargs):
#     listing = instance.listing
#     approved_reviews = listing.reviews.filter(is_approved=True)
#     listing.review_count = approved_reviews.count()
#     avg_rating = approved_reviews.aggregate(avg=Avg('rating'))['avg'] or 0
#     listing.rating = round(avg_rating, 1)
#     listing.save(update_fields=['review_count', 'rating'])
