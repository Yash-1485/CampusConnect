from django.contrib import admin
from .models import Listing, ListingImage
from django.db.models import Count
from django.utils.html import format_html

class ListingImageInline(admin.TabularInline):
    model = ListingImage
    extra = 1
    readonly_fields = ('image_tag',)

    def image_tag(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="100" height="auto" />', obj.image.url)
        return "-"
    image_tag.short_description = 'Preview'

@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ('id','title', 'city', 'state', 'provider_name', 'provider_email', 'provider_phone', 'price', 'created_by', 'created_at', 'image_count')
    search_fields = ('title', 'description', 'city', 'state', 'provider_name', 'provider_email', 'provider_phone')
    list_filter = ('city', 'state', 'category', 'created_at', 'updated_at')
    inlines = [ListingImageInline]
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.annotate(image_count=Count('images'))

    def image_count(self, obj):
        return obj.image_count
    image_count.short_description = "Image Count"
    image_count.admin_order_field = 'image_count'

@admin.register(ListingImage)
class ListingImageAdmin(admin.ModelAdmin):
    list_display = ('listing', 'image_tag', 'uploaded_at')

    def image_tag(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="100" height="auto" />', obj.image.url)
        return "-"
    image_tag.short_description = 'Image Preview'
