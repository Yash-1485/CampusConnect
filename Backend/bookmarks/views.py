from django.shortcuts import get_object_or_404
from django.http import Http404
from .models import Bookmark
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .utils import error_response, success_response
from .serializers import BookmarkSerializer
from django.db import transaction

# Create your views here.
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_bookmark(request):
    try:
        data = request.data.copy()

        # Validate that listing is provided
        if 'listing' not in data:
            return error_response("Listing ID is required", status_code=400)

        serializer = BookmarkSerializer(data=data, context={"request": request})
        if not serializer.is_valid():
            errors = serializer.errors
            first_error_field = next(iter(errors))
            first_error = errors[first_error_field][0]

            error_messages = {
                'required': f"{first_error_field.replace('_', ' ').title()} is required",
                'blank': f"{first_error_field.replace('_', ' ').title()} cannot be blank",
                'invalid': f"Invalid {first_error_field.replace('_', ' ')}",
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
            bookmark = serializer.save()

        return Response({
            "success": True,
            "message": "Listing bookmarked successfully",
            "bookmark": BookmarkSerializer(bookmark, context={"request": request}).data
        }, status=201)

    except Exception as e:
        return error_response("Error while creating bookmark - Internal Server Error", errors=str(e), status_code=500)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_bookmark(request, id):
    try:
        bookmark = get_object_or_404(Bookmark, id=id)

        # Only the user who created the bookmark can delete it
        if bookmark.user != request.user:
            return error_response("You are not allowed to remove this bookmark", status_code=403)

        bookmark.delete()
        return success_response("Bookmark removed successfully")

    except Http404:
        return error_response("No bookmark found on this listing", errors=str(e), status_code=500)
    except Exception as e:
        return error_response("Error while deleting bookmark", errors=str(e), status_code=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_bookmarks(request):
    try:
        user_id = request.query_params.get('user')
        listing_id = request.query_params.get('listing')

        bookmarks = Bookmark.objects.all()
        
        # If the logged-in user is not staff/admin, restrict to their own bookmarks
        if not request.user.is_staff or request.user.role!="admin":
            bookmarks = bookmarks.filter(user=request.user)

        if user_id:
            bookmarks = bookmarks.filter(user__id=user_id)
        if listing_id:
            bookmarks = bookmarks.filter(listing__id=listing_id)

        serializer = BookmarkSerializer(bookmarks, many=True)
        return Response({ "success": True, "count": bookmarks.count(), "bookmarks": serializer.data}, status=200)

    except Exception as e:
        return error_response( message="Error fetching bookmarks", errors=str(e), status_code=500)