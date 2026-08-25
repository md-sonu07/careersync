from django.contrib import admin
from institutions.models import Institution


@admin.register(Institution)
class InstitutionAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'state', 'country', 'is_verified', 'created_at')
    list_filter = ('is_verified', 'state', 'country')
    search_fields = ('name', 'city', 'state')
    ordering = ('name',)
    actions = ['verify_institutions', 'unverify_institutions']

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        for ap in obj.academicians.select_related('user').all():
            if ap.user:
                ap.user.is_verified = obj.is_verified
                ap.user.save(update_fields=['is_verified'])

    @admin.action(description="Mark selected institutions as Verified")
    def verify_institutions(self, request, queryset):
        queryset.update(is_verified=True)
        for inst in queryset:
            for ap in inst.academicians.select_related('user').all():
                if ap.user:
                    ap.user.is_verified = True
                    ap.user.save(update_fields=['is_verified'])

    @admin.action(description="Mark selected institutions as Unverified")
    def unverify_institutions(self, request, queryset):
        queryset.update(is_verified=False)
        for inst in queryset:
            for ap in inst.academicians.select_related('user').all():
                if ap.user:
                    ap.user.is_verified = False
                    ap.user.save(update_fields=['is_verified'])
