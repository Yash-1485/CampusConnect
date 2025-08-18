from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_bookmarks, name='bookmarks.get_bookmarks'),
    path('create/', views.create_bookmark, name='bookmarks.create_bookmark'),
    path('<int:id>/delete/', views.remove_bookmark, name='bookmarks.remove_bookmark'),
    path("toggle/", views.toggle_bookmark, name="bookmarks.toggle"),
]
