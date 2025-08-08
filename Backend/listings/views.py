# views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdminRole
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.views.decorators.csrf import csrf_exempt
from .models import Listing
from .serializers import ListingSerializer
from .utils import error_response

# We did this before
# @csrf_exempt
# @api_view(['POST'])
# @permission_classes([IsAdminRole])
# def create_listing(request):
#     try:
#         data = request.data
#         serializer = ListingSerializer(data=data, context={'request': request})
        
#         if not serializer.is_valid():
#             errors = serializer.errors
            
#             if 'title' in errors:
#                 title_errors = errors['title']
#                 for err in title_errors:
#                     if 'required' in str(err).lower():
#                         return error_response("Title is required", status_code=400, errors=errors)
#                     elif 'max_length' in str(err).lower():
#                         return error_response("Title cannot exceed 200 characters", status_code=400, errors=errors)
            
#             if 'price' in errors:
#                 price_errors = errors['price']
#                 for err in price_errors:
#                     if 'required' in str(err).lower():
#                         return error_response("Price is required", status_code=400, errors=errors)
#                     elif 'invalid' in str(err).lower():
#                         return error_response("Invalid price format", status_code=400, errors=errors)
#                     elif 'min_value' in str(err).lower():
#                         return error_response("Price cannot be negative", status_code=400, errors=errors)
            
#             if 'images' in errors:
#                 images_errors = errors['images']
#                 if any('required' in str(err).lower() for err in images_errors):
#                     return error_response("At least one image is required", status_code=400, errors=errors)
            
#             # General required fields check
#             required_fields = [
#                 'title', 'description', 'category', 'provider_name',
#                 'provider_phone', 'provider_email', 'address', 'price',
#                 'location_city', 'location_state', 'latitude', 'longitude'
#             ]
#             if any(field in errors for field in required_fields):
#                 return error_response("All required fields must be provided", status_code=400, errors=errors)
            
#             return error_response("Validation error", status_code=400, errors=errors)
        
#         if serializer.is_valid():
#             listing = serializer.save(created_by=request.user)
#             return Response({
#                 "success": True,
#                 "message": "Listing created successfully",
#                 "listing": ListingSerializer(listing, context={'request': request}).data
#             }, status=201)
            
#     except Exception as e:
#         return error_response("Error while creating listing - Internal Server Error", str(e), 500)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminRole])
def create_listing(request):
    try:
        # data = request.data
        data = request.data.copy()
        
        # For image only - We did it before to upload image using form and url both
        # Handle different content types
        # if 'images' not in data and 'images[]' in request.FILES:
        #     data['images'] = request.FILES.getlist('images[]')
        # elif isinstance(data.get('images'), dict):
        #     data['images'] = [data['images']]

        #If images uploaded from form
        if not data.get('images') and request.FILES:
            images = request.FILES.getlist('images') or request.FILES.getlist('images[]')
            data.setlist('images', images)
        
        # We did this before and worked perfectly
        serializer = ListingSerializer(data=data, context={'request': request})
        
        if not serializer.is_valid():
            errors = serializer.errors
            
            # Get the first field with error
            first_error_field = next(iter(errors))
            first_error = errors[first_error_field][0]  # Get first error message
            
            # Common error message formats
            error_messages = {
                'required': f"{first_error_field.replace('_', ' ').title()} is required",
                'blank': f"{first_error_field.replace('_', ' ').title()} cannot be blank",
                'invalid': f"Invalid {first_error_field.replace('_', ' ')}",
                'min_length': f"{first_error_field.replace('_', ' ').title()} too short",
                'max_length': f"{first_error_field.replace('_', ' ').title()} too long",
                'min_value': f"{first_error_field.replace('_', ' ').title()} cannot be negative",
            }
            
            # Find matching error message
            error_msg = None
            for error_type, message in error_messages.items():
                if error_type in str(first_error).lower():
                    error_msg = message
                    break
            
            # Default message if no specific pattern matched
            if not error_msg:
                # error_msg = f"Validation error for {first_error_field}: {first_error}"
                error_msg = f"{first_error}"
            
            return error_response(error_msg, status_code=400, errors=errors)
        
        # If valid, create listing
        listing = serializer.save(created_by=request.user)
        return Response({
            "success": True,
            "message": "Listing created successfully",
            "listing": ListingSerializer(listing, context={'request': request}).data
        }, status=201)
            
    except Exception as e:
        return error_response("Error while creating listing - Internal Server Error", str(e), 500)

@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAdminRole])
def update_listing(request, id):
    try:
        listing = Listing.objects.get(id=id)
        data = request.data
        serializer = ListingSerializer(listing, data=data, partial=True, context={'request': request})
        
        if not serializer.is_valid():
            errors = serializer.errors
            return error_response("Validation error", status_code=400, errors=errors)
            
        if serializer.is_valid():
            listing = serializer.save()
            return Response({
                "success": True,
                "message": "Listing updated successfully",
                "listing": ListingSerializer(listing, context={'request': request}).data
            }, status=200)
            
    except Listing.DoesNotExist:
        return error_response("Listing not found", status_code=404)
    except Exception as e:
        return error_response("Error while updating listing - Internal Server Error", str(e), 500)

@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAdminRole])
def delete_listing(request, id):
    try:
        listing = Listing.objects.get(id=id)
        listing.delete()
        return Response({
            "success": True,
            "message": "Listing deleted successfully"
        }, status=200)
    except Listing.DoesNotExist:
        return error_response("Listing not found", status_code=404)
    except Exception as e:
        return error_response("Error while deleting listing - Internal Server Error", str(e), 500)