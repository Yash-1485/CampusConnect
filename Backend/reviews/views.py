from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from listings.models import Listing
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.db import transaction
from .models import Review, Listing
from .serializers import ReviewSerializer, ReviewUpdateSerializer, AdminReviewApprovalSerializer
from .permissions import IsAdminRole
from .utils import error_response, success_response

# Create your views here.
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review(request):
    try:
        data = request.data.copy()
        listing_id = data.get("listing")
        user_id = data.get("user")

        # Check if listing ID is provided
        if not listing_id:
            return error_response("User ID is required", status_code=400)
        
        if not listing_id:
            return error_response("Listing ID is required", status_code=400)

        # Check if listing exists
        listing = get_object_or_404(Listing, id=listing_id)

        # Check for duplicate review
        if Review.objects.filter(user=request.user, listing=listing).exists():
            return error_response("You have already submitted a review for this listing", status_code=400)

        # Attach correct IDs
        data["user"] = request.user.id
        data["listing"] = listing.id

        serializer = ReviewSerializer(data=data, context={"request": request})
        if not serializer.is_valid():
            errors = serializer.errors

            # Get the first field with error
            first_error_field = next(iter(errors))
            first_error = errors[first_error_field][0]

            # Common message patterns
            error_messages = {
                'required': f"{first_error_field.replace('_', ' ').title()} is required",
                'blank': f"{first_error_field.replace('_', ' ').title()} cannot be blank",
                'invalid': f"Invalid {first_error_field.replace('_', ' ')}",
                'min_length': f"{first_error_field.replace('_', ' ').title()} too short",
                'max_length': f"{first_error_field.replace('_', ' ').title()} too long",
                'min_value': f"{first_error_field.replace('_', ' ').title()} is too low",
                'max_value': f"{first_error_field.replace('_', ' ').title()} is too high",
            }

            # Try to find matching pattern
            error_msg = None
            for error_type, message in error_messages.items():
                if error_type in str(first_error).lower():
                    error_msg = message
                    break

            # Default to serializer's message if no match
            if not error_msg:
                error_msg = str(first_error)

            return error_response(error_msg, status_code=400, errors=errors)

        # Save review
        with transaction.atomic():
            review = serializer.save()

        return Response({
            "success": True,
            "message": "Review submitted successfully (pending approval)",
            "review": ReviewSerializer(review, context={"request": request}).data
        }, status=201)

    except Exception as e:
        return error_response("Error while creating review - Internal Server Error", str(e), 500)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_review(request, id):
    try:
        review = get_object_or_404(Review, id=id)
        data = request.data.copy()
        listing_id = data.get("listing")
        print(listing_id,review.listing.id)
        if review.user != request.user:
            return error_response("You are not allowed to edit this review", status_code=403)

        if review.listing.id != int(listing_id):
            return error_response("No review found with this listing", status_code=403)

        serializer = ReviewUpdateSerializer(review, data=request.data, partial=True, context={"request": request})
        if not serializer.is_valid():
            errors = serializer.errors
            first_error_field = next(iter(errors))
            first_error = errors[first_error_field][0]

            error_messages = {
                'required': f"{first_error_field.replace('_', ' ').title()} is required",
                'blank': f"{first_error_field.replace('_', ' ').title()} cannot be blank",
                'invalid': f"Invalid {first_error_field.replace('_', ' ')}",
                'min_length': f"{first_error_field.replace('_', ' ').title()} too short",
                'max_length': f"{first_error_field.replace('_', ' ').title()} too long",
                'min_value': f"{first_error_field.replace('_', ' ').title()} is too low",
                'max_value': f"{first_error_field.replace('_', ' ').title()} is too high",
            }

            error_msg = None
            for error_type, message in error_messages.items():
                if error_type in str(first_error).lower():
                    error_msg = message
                    break

            if not error_msg:
                error_msg = str(first_error)

            return error_response(error_msg, status_code=400, errors=errors)

        with transaction.atomic():
            updated_review = serializer.save()

        return Response({
            "success": True,
            "message": "Review updated successfully",
            "review": ReviewUpdateSerializer(updated_review).data
        }, status=200)

    except Exception as e:
        return error_response("Error while updating review - Internal Server Error", errors=str(e), status_code=500)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_review(request, id):
    try:
        review = get_object_or_404(Review, id=id)

        # Check ownership
        if review.user != request.user:
            return error_response("You are not allowed to delete this review", status_code=403)

        review.delete()
        
        return success_response("Review deleted successfully")

    except Http404:
        return error_response("No review found on this listing", status_code=500)
    except Exception as e:
        return error_response("Error while deleting review - Internal Server Error", errors=str(e), status_code=500)
    
@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdminRole])
def get_reviews(request):
    try:
        listing = request.query_params.get("listing")
        user = request.query_params.get("user")

        reviews = Review.objects.all().select_related("user", "listing")

        if listing:
            reviews = reviews.filter(listing=listing)

        if user:
            reviews = reviews.filter(user=user)

        serializer = ReviewSerializer(reviews, many=True)
        return Response({"status": "success", "reviews": serializer.data}, status=200)

    except Exception as e:
        return error_response("Internal Server Error | Error while getting reviews",errors=str(e),status_code=500)

# We have to pass is_approved=true then it will work, can be used for toggle in future
@api_view(["PATCH","PUT","GET"])
def approve_review(request, id):
    try:
        review = Review.objects.get(id=id)
    except Review.DoesNotExist:
        return error_response(message="Review not found", status_code=404)

    serializer = AdminReviewApprovalSerializer(review, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        # Return full review after approval
        full_review = ReviewSerializer(review)
        return Response({"success":True,"message":"Review approved" ,"review":full_review.data},status=200)

    return error_response(message="Error while approving review",errors=serializer.errors, status_code=400)