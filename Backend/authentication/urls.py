from django.urls import path
from . import views

urlpatterns = [
    path("signup/", views.signup, name="auth.signup"),
    path("login/", views.login, name="auth.login"),
    path("logout/", views.logout, name="auth.logout"),
    # path("profile/", views.profile, name="auth.user_profile"),
    path("profile/", views.update_profile, name="auth.user_profile"),
    path("user/", views.get_user, name="auth.get_user"),
]
