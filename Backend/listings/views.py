# views.py
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import IsAdminRole
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, NotFound
from django.views.decorators.csrf import csrf_exempt
from .models import Listing
from .serializers import ListingSerializer, UpdateListingSerializer
from .utils import error_response, success_response
from rest_framework.generics import ListAPIView
from .pagination import CustomPageNumberPagination
from django.db.models import Q, Count
from django.utils.timezone import now

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
# @permission_classes([IsAuthenticated,IsAdminRole])
@permission_classes([IsAuthenticated])
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
@permission_classes([AllowAny])
def get_all_listings(request):
    try:
        # listings = Listing.objects.filter(is_active=True).all()
        listings = Listing.objects.all()
        serializer = ListingSerializer(listings, many=True, context={'request': request})
        if serializer.data:
            return success_response(message="All listings returned successfully",data=serializer.data, status_code=200)
        else:
            return success_response(message="No active listings found",data=serializer.data, status_code=200)
    except Exception as e:
        return error_response(message="Error while retrieving listings", data=str(e), status_code=500)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated,IsAdminRole])
def get_all_listings_admin(request):
    try:
        listings = Listing.objects.all()
        serializer = ListingSerializer(listings, many=True, context={'request': request})
        return success_response(message="All listings returned successfully",data=serializer.data, status_code=200)
    except Exception as e:
        return error_response(message="Error while retrieving listings", data=str(e), status_code=500)
    
# For Pagination
class ListingListView(ListAPIView):
    serializer_class = ListingSerializer
    pagination_class = CustomPageNumberPagination
    api_view = ['GET']
    permission_classes = [AllowAny]
    # queryset = Listing.objects.all().order_by('-id')
    
    def get_queryset(self):
        queryset = Listing.objects.all()

        # --- Manual Filtering ---
        city = self.request.query_params.get('city')
        state = self.request.query_params.get('state')
        district = self.request.query_params.get('district')
        category = self.request.query_params.get('category')
        room_type = self.request.query_params.get('room_type')
        gender = self.request.query_params.get('gender')
        min_budget = self.request.query_params.get('min')
        max_budget = self.request.query_params.get('max')
        
        if city:
            queryset = queryset.filter(city__iexact=city)
        if state:
            queryset = queryset.filter(state__iexact=state)
        if district:
            queryset = queryset.filter(district__iexact=district)
        if category:
            queryset = queryset.filter(category__iexact=category)
        if room_type:
            queryset = queryset.filter(room_type__iexact=room_type)
        if gender:
            queryset = queryset.filter(gender_preference__iexact=gender)
        if min_budget:
            queryset = queryset.filter(price__gte=float(min_budget))
        if max_budget:
            queryset = queryset.filter(price__lte=float(max_budget))

        # --- Manual Search ---
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(city__icontains=search) |
                Q(state__icontains=search) |
                Q(category__icontains=search)
            )

        return queryset

# For Admin Panel Listing - Stats
@api_view(["GET"])
@permission_classes([IsAuthenticated,IsAdminRole])
def listing_growth_stats(request):
    try:
        today = now()
        current_month = today.month
        current_year = today.year

        # Handle last month rollover
        last_month = 12 if current_month == 1 else current_month - 1
        last_month_year = current_year - 1 if current_month == 1 else current_year

        qs = Listing.objects.all()

        # total_listings = qs.filter(is_active=True).count()
        total_listings = qs.count()

        # Listings created this month
        this_month_count = qs.filter( created_at__year=current_year, created_at__month=current_month).count()

        # Listings created last month
        last_month_count = qs.filter( created_at__year=last_month_year, created_at__month=last_month).count()

        # Growth percentage calculation
        if last_month_count > 0:
            growth_percentage = ((this_month_count - last_month_count) / last_month_count) * 100
        else:
            growth_percentage = 100 if this_month_count > 0 else 0
            
        # 🔹 Category wise listings
        category_stats = (qs.values("category").annotate(count=Count("id")).order_by("-count"))

        # 🔹 State wise listings (only for the relevant states you listed)
        relevant_states = [
            "Maharashtra",
            # "Delhi NCR",
            "Rajasthan",
            "Delhi",
            "Karnataka",
            "Gujarat",
            "Tamil Nadu",
            "West Bengal",
            "Uttar Pradesh",
            "Telangana",
            "Andhra Pradesh",
        ]
        state_stats = (qs.filter(state__in=relevant_states).values("state").annotate(count=Count("id")).order_by("-count"))

        stats = {
            "total": total_listings,
            "thisMonth": this_month_count,
            "lastMonth": last_month_count,
            "growth": round(growth_percentage, 1),
            "isPositive": growth_percentage >= 0,
            "categoryWise": list(category_stats),
            "stateWise": list(state_stats),
        }

        return success_response(data=stats,message="Listings Stats Fetched successfully")
    except Exception as e:
        return error_response(message="Error occured in Listing Stats sending",status_code=500)

@api_view(["GET"])
@permission_classes([IsAuthenticated,IsAdminRole])
def admin_listing_stats(request):
    try:
        today = now()
        current_month = today.month
        current_year = today.year

        last_month = 12 if current_month == 1 else current_month - 1
        last_month_year = current_year - 1 if current_month == 1 else current_year

        qs = Listing.objects.filter(created_by=request.user)

        total_listings = qs.count()
        this_month_count = qs.filter(created_at__year=current_year, created_at__month=current_month).count()
        last_month_count = qs.filter(created_at__year=last_month_year, created_at__month=last_month).count()

        growth_percentage = (
            ((this_month_count - last_month_count) / last_month_count) * 100
            if last_month_count > 0 else
            (100 if this_month_count > 0 else 0)
        )

        recent_listings = list(qs.order_by('-created_at')[:5].values('id', 'title', 'category', 'availability', 'city', 'state', 'price', 'created_at'))

        stats = {
            "total": total_listings,
            "thisMonth": this_month_count,
            "lastMonth": last_month_count,
            "growth": round(growth_percentage, 1),
            "isPositive": growth_percentage >= 0,
            "recentListings": recent_listings
        }

        return success_response(data=stats, message="Listings Stats Fetched successfully")
    except Exception as e:
        return error_response(message="Error occurred in Listing Stats sending", status_code=500)

# --
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recommended_listings(request):
    user = request.user
    listings = Listing.objects.filter(
        city = user.preferred_city,
        state = user.preferred_state,
        is_active = True
    ).order_by('-rating')[:5]

    serializer = ListingSerializer(listings,many=True,context={'request': request})
    return Response({"status": "success", "listings": serializer.data})