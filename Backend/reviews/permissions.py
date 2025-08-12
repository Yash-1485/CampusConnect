# permissions.py
from rest_framework import permissions

class IsAdminRole(permissions.BasePermission):
    """
    Allows access only to users with role='admin'
    """
    def has_permission(self, request, view):
        # print("Checking permission for admins only")
        return bool(request.user and request.user.role == 'admin')