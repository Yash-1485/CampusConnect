from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_bookmarks, name='bookmarks.get_bookmarks'),
    path('create/', views.create_bookmark, name='bookmarks.create_bookmark'),
    path('<int:id>/delete/', views.remove_bookmark, name='bookmarks.remove_bookmark'),
    path("toggle/", views.toggle_bookmark, name="bookmarks.toggle"),
    # --
    path('user/count/', views.user_bookmark_count, name='bookmarks.user_bookmark_count'),
    path('user/recent', views.recent_bookmarks, name='bookmarks.recent_bookmarks')
]
