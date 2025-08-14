from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from django.views.decorators.csrf import csrf_exempt
import json
from .serializers import SignupSerializer, LoginSerializer, UserSerializer, UpdateProfileSerializer
from .utils import get_tokens_for_user, error_response
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