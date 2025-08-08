from django.core.exceptions import ValidationError
from PIL import Image

def validate_image_type_and_size(image):
    if image.size > 3 * 1024 * 1024:
        raise ValidationError("Image must be under 5MB")

    try:
        img = Image.open(image)
        if img.format.upper() not in ["JPEG", "PNG", "JPG"]:
            raise ValidationError("Only JPEG, JPG and PNG formats are supported")
    except Exception:
        raise ValidationError("Invalid image file")
