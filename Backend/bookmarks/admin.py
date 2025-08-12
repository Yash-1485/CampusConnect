from django.contrib import admin
from .models import Bookmark

@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ('id','user', 'listing', 'created_at')  # Columns to show in list
    search_fields = ('user__full_name', 'listing__title')  # Search by username and listing title
    list_filter = ('created_at',)  # Filter by creation date
    ordering = ('-created_at',)  # Default ordering (latest first)
