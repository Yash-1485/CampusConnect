import csv
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from listings.models import Listing

User = get_user_model()

class Command(BaseCommand):
    help = "Import Listings from CSV (replace all existing data)"

    def add_arguments(self, parser):
        parser.add_argument("csv_file", type=str, help="Path to listings.csv file")

    def handle(self, *args, **options):
        csv_file = options["csv_file"]

        # ✅ Use email instead of username
        try:
            admin_user = User.objects.get(email="admin_cc_main@gmail.com")  # change to your actual superuser email
        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR("❌ User with email 'admin_cc_main@gmail.com' not found. Please create it first.")
            )
            return

        # 🚨 Clear all existing listings
        Listing.objects.all().delete()
        self.stdout.write(self.style.WARNING("⚠️ Deleted all existing listings"))

        with open(csv_file, newline="", encoding="utf-8") as file:
            reader = csv.DictReader(file)

            for row in reader:
                listing = Listing.objects.create(
                    title=row["Title"],
                    description=row["Description"],
                    category=row["Category"],
                    provider_name=row["Provider Name"],
                    provider_phone=row["Provider Phone"],
                    provider_email=row["Provider Email"],
                    address=row["Address"],
                    price=row["Price"],
                    district=row["District"],
                    pincode=row["Pincode"],
                    city=row["City"],
                    state=row["State"],
                    room_type=row["Room Type"],
                    occupancy_limit=row["Occupancy Limit"],
                    gender_preference=row["Gender Preference"],
                    food_included=row["Food Included"].lower() in ("true", "1"),
                    is_furnished=row["Is Furnished"].lower() in ("true", "1"),
                    amenities=row["Amenities"].split(",") if row["Amenities"] else [],
                    availability=row["Availability"].lower() in ("true", "1"),
                    rating=row["Rating"],
                    review_count=row["Review Count"],
                    is_active=row["Is Active"].lower() in ("true", "1"),
                    created_by=admin_user,
                )

                self.stdout.write(self.style.SUCCESS(f"✅ Added listing with ID {listing.id}: {listing.title}"))
