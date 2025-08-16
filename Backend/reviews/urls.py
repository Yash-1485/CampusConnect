from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_reviews, name='reviews.get_reviews'),
    path('reviewsStats/', views.review_growth_stats, name='reviews.reviews_growth_stats'),
    path('recentReviews/', views.recent_pending_reviews, name='reviews.recent_pending_reviews'),
    path('create/', views.create_review, name='reviews.create_review'),
    path('<int:id>/update/', views.update_review, name='reviews.update_review'),
    path('<int:id>/delete/', views.delete_review, name='reviews.delete_review'),
    path('admin/<int:id>/approve/', views.approve_review, name='reviews.approve_review'),
    path('admin/get_reviews/', views.admin_get_reviews, name='reviews.admin_get_reviews'),
]