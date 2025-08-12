from django.contrib import admin
from .models import Review  # import your model

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'listing', 'rating', 'comment', 'created_at')  
    search_fields = ('comment', 'user__username', 'listing__title')  
    list_filter = ('rating', 'created_at')  
    ordering = ('-created_at',)  
    list_per_page = 20  
