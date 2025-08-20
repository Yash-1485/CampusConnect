from django.urls import path
from .views import predict_sentiment

urlpatterns = [
    path("predict/", predict_sentiment, name="ml.predict_sentiment"),
]
