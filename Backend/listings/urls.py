from django.urls import path
from . import views

urlpatterns = [
    path('', views.ListingListView.as_view(), name='listings.get_all_listings'),
    path('allListings/', views.get_all_listings, name='listings.get_all_listings'),
    path('<int:id>/', views.get_listing_by_id, name='listings.get_listing_by_id'),
    path('create/', views.create_listing, name='listings.create_listing'),
    path('<int:id>/update/', views.update_listing, name='listings.update_listing'),
    path('<int:id>/delete/', views.delete_listing, name='listings.delete_listing'),
    path('<int:id>/toggle-status/', views.toggle_listing_status, name='listings.toggle_listing_status'),
    path('admin/', views.get_all_listings_admin, name='listings.get_all_listings_admin'),
    path('listingsStats/', views.listing_growth_stats, name='listings.listings_growth_stats'),
    path('adminStats/', views.admin_listing_stats, name='listings.admin_listing_stats'),
    # --
    path('recommendedListings/', views.recommended_listings, name='recommended_listings')
]