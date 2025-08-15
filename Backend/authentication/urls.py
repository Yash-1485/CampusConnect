from django.urls import path
from . import views

urlpatterns = [
    path("signup/", views.signup, name="auth.signup"),
    path("login/", views.login, name="auth.login"),
    path("logout/", views.logout, name="auth.logout"),
    # path("profile/", views.profile, name="auth.user_profile"),
    path("profile/", views.update_profile, name="auth.user_profile"),
    path("user/", views.get_user, name="auth.get_user"),
    path("userStats/", views.user_growth_stats, name="auth.get_user_growth_stats"),
    
    # Tirth
    path('users/', views.get_users, name='get_users'),
    path('users/delete/<int:user_id>/', views.delete_user_api, name='delete_user_api'),
]
