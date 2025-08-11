from django.core.exceptions import ValidationError
from PIL import Image
from authentication.models import User

def validate_image_type_and_size(image):
    if image.size > 3 * 1024 * 1024:
        raise ValidationError("Image must be under 3MB")

    try:
        img = Image.open(image)
        if img.format.upper() not in ["JPEG", "PNG", "JPG", "WEBP"]:
            raise ValidationError("Only JPEG, JPG and PNG formats are supported")
    except Exception:
        raise ValidationError("Invalid image file")

def validate_created_by(user_id):
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        raise ValidationError("User does not exist.")

    if user.role != "admin":
        raise ValidationError("Only admins can create listings.")
