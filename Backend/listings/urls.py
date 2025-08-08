from django.urls import path
from . import views

urlpatterns = [
    # path('', views.get_all_listings, name='listings.get_all_listings'),
    # path('<int:id>/', views.get_listing_by_id, name='listings.get_listing_by_id'),
    path('create/', views.create_listing, name='listings.create_listing'),
    # path('<int:id>/update/', views.update_listing, name='listings.update_listing'),
    # path('<int:id>/delete/', views.delete_listing, name='listings.delete_listing'),
    # path('<int:id>/toggle-status/', views.toggle_listing_status, name='listings.toggle_listing_status'),
    # path('admin/', views.get_all_listings_admin, name='listings.get_all_listings_admin'),
]
