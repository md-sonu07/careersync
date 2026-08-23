from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from accounts.models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Django Admin interface for custom User model.
    """
    list_display = (
        'email',
        'first_name',
        'last_name',
        'role',
        'is_verified',
        'is_active',
        'is_staff',
        'created_at',
    )
    list_filter = (
        'role',
        'is_verified',
        'is_active',
        'is_staff',
        'is_superuser',
        'created_at',
    )
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('-created_at',)

    fieldsets = (
        ('Account Credentials', {'fields': ('email', 'password')}),
        ('Personal Information', {'fields': ('first_name', 'last_name')}),
        ('Role & Status', {'fields': ('role', 'is_verified')}),
        ('Permissions', {
            'fields': (
                'is_active',
                'is_staff',
                'is_superuser',
                'groups',
                'user_permissions',
            ),
        }),
        ('System Metadata', {'fields': ('id', 'created_at', 'updated_at')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email',
                'first_name',
                'last_name',
                'role',
                'password1',
                'password2',
            ),
        }),
    )

    readonly_fields = ('id', 'created_at', 'updated_at')
