import csv
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from listings.models import Listing

User = get_user_model()

class Command(BaseCommand):
    help = "Import Listings from CSV (append, do not delete existing)"

    def add_arguments(self, parser):
        parser.add_argument("csv_file", type=str, help="Path to listings.csv file")

    def handle(self, *args, **options):
        csv_file = options["csv_file"]

        try:
            admin_user = User.objects.get(email="admin_cc_main@gmail.com")
        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR("❌ User with email 'admin_cc_main@gmail.com' not found. Please create it first.")
            )
            return

        with open(csv_file, newline="", encoding="utf-8") as file:
            reader = csv.DictReader(file)

            for row in reader:
                listing, created = Listing.objects.get_or_create(
                    title=row["title"],
                    provider_email=row["provider_email"],  # using these as unique-ish fields
                    defaults={
                        "description": row["description"],
                        "category": row["category"],
                        "provider_name": row["provider_name"],
                        "provider_phone": row["provider_phone"],
                        "address": row["address"],
                        "price": row["price"],
                        "district": row["district"],
                        "pincode": row["pincode"],
                        "city": row["city"],
                        "state": row["state"],
                        "room_type": row["room_type"],
                        "occupancy_limit": row["occupancy"],
                        "gender_preference": row["gender_preference"],
                        "food_included": row["food_included"].lower() in ("true", "1"),
                        "is_furnished": row["is_furnished"].lower() in ("true", "1"),
                        "amenities": row["amenities"].split(",") if row["amenities"] else [],
                        "availability": row.get("availability", "true").lower() in ("true", "1"),
                        "rating": row["rating"],
                        "review_count": row["review_count"],
                        "is_active": row["is_active"].lower() in ("true", "1"),
                        "created_by": admin_user,
                    },
                )

                if created:
                    self.stdout.write(self.style.SUCCESS(f"✅ Added listing: {listing.title}"))
                else:
                    self.stdout.write(self.style.WARNING(f"⚠️ Skipped duplicate: {listing.title}"))
