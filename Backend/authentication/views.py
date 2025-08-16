from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from listings.permissions import IsAdminRole
from django.utils.timezone import now
from django.utils.timesince import timesince
from django.db.models import F
from django.db.models import Count
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from django.views.decorators.csrf import csrf_exempt
import json
from .serializers import SignupSerializer, LoginSerializer, UserSerializer, UpdateProfileSerializer
from .utils import get_tokens_for_user, error_response, success_response
from django.contrib.auth import get_user_model

User = get_user_model()

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    try:
        data=data=request.data
        serializer = SignupSerializer(data=data)
        if not serializer.is_valid():
            errors=serializer.errors
            
            if "email" in errors:
                email_errors = errors["email"]
                for err in email_errors:
                    if "already exists" in str(err).lower():
                        return error_response("Email already exists", status_code=400, errors=errors)
                    elif "valid email address" in str(err).lower() or "invalid" in str(err).lower():
                        return error_response("Invalid email address", status_code=400, errors=errors)
                    else:
                        return error_response(str(err), status_code=400, errors=errors)
            
            if "password" in errors:
                password_errors = errors["password"]
                if any("8 characters" in str(msg).lower() for msg in password_errors) or 'min_length' in str(errors['password']):
                    return error_response("Password must be at least 8 characters long", status_code=400, errors=errors)
            
            if "phone" in errors:
                phone_errors = errors["phone"]
                if any("10 digits" in str(msg).lower() for msg in phone_errors) or 'min_length' in str(errors['phone']) or 'max_length' in str(errors['phone']):
                    return error_response("Phone number must be 10 digits long", status_code=400, errors=errors)
                if any("Invalid phone number" in str(msg).lower() for msg in phone_errors):
                    return error_response("Invalid phone number format", status_code=400, errors=errors)

            if "role" in errors:
                return error_response("Invalid role - Must be from user or admin", status_code=400, errors=errors)
            
            # required_fields = ['email', 'password', 'full_name', 'phone', 'role']
            if any(field in errors for field in ['email', 'password', 'full_name', 'phone', 'role']):
                return error_response("All fields are required", status_code=400,errors=errors)
            
        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            response = Response({
                "success": True,
                "message": "Signup successful",
                "user": UserSerializer(user, context={'request': request}).data
            }, status=201)
            response.set_cookie("token", tokens["access"], httponly=True)
            return response
    except Exception as e:
        return error_response("Error while Signing Up - Internal Server Error", str(e), 500)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    try:
        serializer = LoginSerializer(data=request.data)        
        if (not request.data.get('email') or not request.data.get('password')) and (not serializer.is_valid()):
            return error_response("All fields are required", status_code=400,errors=serializer.errors)
        
        if not serializer.is_valid():
            return error_response("Invalid email or password", status_code=401,errors=serializer.errors)
        
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data['user']
            tokens = get_tokens_for_user(user)
            response = Response({
                "success": True,
                "message": "Login successful",
                "user": UserSerializer(user, context={'request': request}).data
            }, status=200)
            print("here")
            response.set_cookie("token", tokens["access"], httponly=True)
            return response
    except Exception as e:
        return error_response("Login failed", str(e), 400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    try:
        return Response({
            "success": True,
            "user": UserSerializer(request.user, context={'request': request}).data # Used  context={'request': request} for full image path with localhost:8000
        })
    except Exception as e:
        return error_response("Failed to get profile", str(e), 500)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_profile(request):
    try:
        user = request.user

        if hasattr(request.data, 'getlist'):
            data = request.data.copy()
            
            print(data.getlist('preferred_locations'))
            for field in ['preferred_categories', 'preferred_amenities']:
                if field in data:
                    data.setlist(field, data.getlist(field))

            if 'preferred_locations' in data:
                if isinstance(data['preferred_locations'], list):
                    data['preferred_locations'] = json.dumps(data['preferred_locations'])
        else:
            data = request.data
        if 'profileImage' in request.FILES:
            data['profileImage'] = request.FILES['profileImage']

        if "categories" in data and isinstance(data["categories"], str):
            try:
                data["categories"] = json.loads(data["categories"])
                print(data["categories"])
            except json.JSONDecodeError as e:
                print(e)
        if 'amenities' in request.data:
            data.setlist('amenities', request.data.getlist('amenities'))
        serializer = UpdateProfileSerializer(user, data=data, partial=True)

        # Check: At least one field is sent
        if not any(request.data.get(field) is not None for field in UpdateProfileSerializer.Meta.fields):
            return error_response("At least one field is required to update profile", status_code=400)

        # Run validation
        if not serializer.is_valid():
            errors = serializer.errors
            print(errors)
            # Custom field-specific responses
            if 'full_name' in errors:
                return error_response("Full name can't be empty", errors=errors, status_code=400)

            if 'phone' in errors:
                phone_errors = errors['phone']
                if any('10 digits' in str(e).lower() or 'min_length' in str(e) or 'max_length' in str(e) for e in phone_errors):
                    return error_response("Phone number must be 10 digits long", errors=errors, status_code=400)
                return error_response("Invalid phone number format", errors=errors, status_code=400)

            else:
                first_error = next(iter(errors.values()))[0]
                return error_response(message=first_error ,errors = errors, status_code=400)

        # Save if valid
        serializer.save()

        # Return updated data
        updated_user = User.objects.get(pk=user.pk)
        user_data = UserSerializer(updated_user, context={'request': request}).data

        return Response({ "success": True, "message": "Profile updated", "user": user_data})

    except Exception as e:
        return error_response("Profile update failed", str(e), 500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    response = Response({"success": True, "message": "Logged out successfully"},status=200)
    response.delete_cookie("token")
    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    try:
        user = request.user
        serializer = UserSerializer(user, context={'request': request})
        # return Response({
        #     "success": True,
        #     "message": "User retrieved successfully",
        #     "user": serializer.data
        # }, status=200)
        return Response(serializer.data,status=200)
    except Exception as e:
        print(f"Error fetching user: {str(e)}")
        return error_response("Could not fetch user", status_code=500)
    
# --------------------------------------------------------------------------------------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_user(request):
    user = request.user
    return Response({
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "phone":user.phone,
    })
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request):
    user = request.user
    serializer = UpdateProfileSerializer(user, data=request.data, partial=True)  # partial=True allows single field updates
    if serializer.is_valid():
        serializer.save()
        return Response({"user": serializer.data}, status=200)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated,IsAdminRole])
def get_users(request):
    users = User.objects.filter(role='user')
    data = []
    for u in users:
        data.append({
            "id": u.id,
            "full_name": u.full_name,
            "email": u.email,
            "phone": u.phone,
            "role": u.role,
            "is_verified": u.is_verified,
            "dob": u.dob,
            "gender": u.gender,
            "city": u.city,
            "district": u.district,
            "state": u.state,
            "pincode": u.pincode,
            "affiliation_type": u.affiliation_type,
            "affiliation_name": u.affiliation_name,
            "preferred_city": u.preferred_city,
            "preferred_district": u.preferred_district,
            "preferred_state": u.preferred_state,
            "preferred_pincode": u.preferred_pincode,
            "budget": u.budget,
            "sharing_preference": u.sharing_preference,
            "preferred_categories": u.preferred_categories,
            "preferred_amenities": u.preferred_amenities,
            "preferred_locations": u.preferred_locations,
            "created_at": u.created_at,
            "updated_at": u.updated_at,
            "profileImage": request.build_absolute_uri(u.profileImage.url) if u.profileImage else None,
        })
    return success_response(message="Users fetched successfully",data=data)
# --------------------------------------------------------------------------------------------------------------

@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAuthenticated,IsAdminRole])
def delete_user_api(request, user_id):
    if request.method == 'DELETE':
        user = User.objects.get(id=user_id)
        user.delete()
        return success_response(message= 'success')

# For Admin Panel User - Stats
@api_view(["GET"])
@permission_classes([IsAuthenticated,IsAdminRole])
def user_growth_stats(request):
    try:
        today = now()
        current_month = today.month
        current_year = today.year

        last_month = 12 if current_month == 1 else current_month - 1
        last_month_year = current_year - 1 if current_month == 1 else current_year

        qs = User.objects.filter(role='user')

        # Total users
        total_users = qs.count()

        # Users created this month
        this_month_count = qs.filter( created_at__year=current_year, created_at__month=current_month).count()

        # Users created last month
        last_month_count = qs.filter( created_at__year=last_month_year, created_at__month=last_month).count()

        # Growth percentage
        if last_month_count > 0:
            growth_percentage = ((this_month_count - last_month_count) / last_month_count) * 100
        else:
            growth_percentage = 100 if this_month_count > 0 else 0

        stats = {
            "total": total_users,
            "thisMonth": this_month_count,
            "lastMonth": last_month_count,
            "growth": round(growth_percentage, 1),
            "isPositive": growth_percentage >= 0
        }

        return success_response(data=stats,message="User Stats Fetched successfully")
    except Exception as e:
        return error_response(message="Error occured in User Stats sending",status_code=500)

@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdminRole])
def recent_users(request):
    try:
        users = (
            User.objects.filter(role="user").values(
                'id',
                'full_name',
                'email',
                'city',
                'state',
                'created_at'
            )
            .order_by('-created_at')[:3]
        )

        recent_users_list = []
        for user in users:
            time_diff = timesince(user["created_at"], now())
            user["time_ago"] = time_diff.split(",")[0].strip() + " ago"
            recent_users_list.append(user)

        return success_response( message="Recent users fetched successfully", data=recent_users_list)

    except Exception as e:
        return error_response( message="Error occurred while fetching recent users", status_code=500)