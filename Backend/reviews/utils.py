from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response

def success_response(message, data=None, status_code=200):
    return Response({
        "success": True,
        "message": message,
        "data": data
    }, status=status_code)

def error_response(message, errors=None, status_code=400):
    return Response({
        "success": False,
        "message": message,
        "errors": errors
    }, status=status_code)

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }