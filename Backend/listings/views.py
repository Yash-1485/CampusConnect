# views.py
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdminRole
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, NotFound
from django.views.decorators.csrf import csrf_exempt
from .models import Listing
from .serializers import ListingSerializer, UpdateListingSerializer
from .utils import error_response, success_response

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

# @csrf_exempt
# @api_view(['PUT'])
# @permission_classes([IsAdminRole])
# def update_listing(request, id):
#     try:
#         listing = Listing.objects.get(id=id)
#         data = request.data
#         serializer = ListingSerializer(listing, data=data, partial=True, context={'request': request})
        
#         if not serializer.is_valid():
#             errors = serializer.errors
#             return error_response("Validation error", status_code=400, errors=errors)
            
#         if serializer.is_valid():
#             listing = serializer.save()
#             return Response({
#                 "success": True,
#                 "message": "Listing updated successfully",
#                 "listing": ListingSerializer(listing, context={'request': request}).data
#             }, status=200)
            
#     except Listing.DoesNotExist:
#         return error_response("Listing not found", status_code=404)
#     except Exception as e:
#         return error_response("Error while updating listing - Internal Server Error", str(e), 500)

@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAuthenticated,IsAdminRole])
def update_listing(request, id):
    try:
        # Get listing or return 404
        listing = get_object_or_404(Listing, id=id)
        data = request.data.copy()
        
        # Handle image uploads from form data
        if not data.get('images') and request.FILES:
            images = request.FILES.getlist('images') or request.FILES.getlist('images[]')
            data['images'] = [{'image': img} for img in images]
        
        # Initialize serializer with partial data
        serializer = UpdateListingSerializer(instance=listing, data=data, partial=True, context={'request': request})
        
        # print(serializer.is_valid())
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
        
        # Save valid data
        serializer.save()
        return success_response(message="Listing updated successfully",data=serializer.data,status_code=200)
        
    except NotFound:
        return error_response(message="Listing not found",status_code=404)
    except Exception as e:
        return error_response(message=f"Error while updating listing: {str(e)}", status_code=500)

@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAuthenticated,IsAdminRole])
def delete_listing(request, id):
    try:
        listing = Listing.objects.get(id=id)
        listing.delete()
        return success_response("Listing removed successfully",status_code=200)
    except Listing.DoesNotExist:
        return error_response("Listing not found", status_code=404)
    except Exception as e:
        return error_response("Error while deleting listing - Internal Server Error", str(e), 500)
    
@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated,IsAdminRole])
def toggle_listing_status(request,id):
    try:
        listing = Listing.objects.get(id=id)
        listing.availability=not listing.availability
        listing.save()
        return success_response(f"Listing status toggled to {listing.availability}",status_code=200)
    except Listing.DoesNotExist:
        return error_response("Listing not found", status_code=404)
    except Exception as e:
        return error_response("Error while deleting listing - Internal Server Error", str(e), 500)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated,IsAdminRole])
def get_listing_by_id(request, id):
    try:
        listing = Listing.objects.get(pk=id)
        serializer = ListingSerializer(listing, context={'request': request})
        return success_response(message="Listing found successfully",data=serializer.data, status_code=200)
    except Listing.DoesNotExist:
        return error_response("Listing not found", status_code=404)
    except Exception as e:
        return error_response(message="Error while retrieving listing", data=str(e), status_code=500)

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def get_all_listings(request):
    try:
        listings = Listing.objects.filter(is_active=True).all()
        serializer = ListingSerializer(listings, many=True)
        if serializer.data:
            return success_response(message="All listings returned successfully",data=serializer.data, status_code=200)
        else:
            return success_response(message="No active listings found",data=serializer.data, status_code=200)
    except Exception as e:
        return error_response(message="Error while retrieving listings", data=str(e), status_code=500)
    
@permission_classes([IsAuthenticated,IsAdminRole])
@api_view(['GET'])
def get_all_listings_admin(request):
    try:
        listings = Listing.objects.all()
        serializer = ListingSerializer(listings, many=True)
        return success_response(message="All listings returned successfully",data=serializer.data, status_code=200)
    except Exception as e:
        return error_response(message="Error while retrieving listings", data=str(e), status_code=500)