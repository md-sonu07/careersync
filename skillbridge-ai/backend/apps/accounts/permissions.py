from rest_framework import permissions
from accounts.models import UserRole


class IsStudent(permissions.BasePermission):
    """
    Allows access only to authenticated users with 'student' role.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == UserRole.STUDENT
        )


class IsIndustry(permissions.BasePermission):
    """
    Allows access only to authenticated users with 'industry' role.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == UserRole.INDUSTRY
        )


class IsAcademician(permissions.BasePermission):
    """
    Allows access only to authenticated users with 'academician' role.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == UserRole.ACADEMICIAN
        )


class IsAdminUserRole(permissions.BasePermission):
    """
    Allows access only to authenticated users with 'admin' role or is_staff flag.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.role == UserRole.ADMIN or request.user.is_staff)
        )
