from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_reviews, name='review.get_reviews'),
    path('create/', views.create_review, name='reviews.create_review'),
    path('<int:id>/update/', views.update_review, name='review.update_review'),
    path('<int:id>/delete/', views.delete_review, name='reviews.delete_review'),
    path('admin/<int:id>/approve/', views.approve_review, name='review.approve_review'),
]
