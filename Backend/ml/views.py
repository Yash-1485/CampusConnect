from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from authentication.utils import error_response, success_response
from listings.permissions import IsAdminRole
import joblib, json, os

# Get absolute path to current app folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load model + vectorizer from ml/ folder
model_path = os.path.join(BASE_DIR, "sentiment_model.joblib")
vectorizer_path = os.path.join(BASE_DIR, "tfidf_vectorizer.joblib")

model = joblib.load(model_path)
vectorizer = joblib.load(vectorizer_path)

@api_view(["POST"])
@permission_classes([IsAuthenticated,IsAdminRole])
def predict_sentiment(request):
    try:
        comment = request.data.get("comment", "")

        if not comment:
            return error_response(
                message="No comment provided",
                status_code=400
            )

        # Transform input using saved vectorizer
        comment_vec = vectorizer.transform([comment])

        # Predict sentiment
        prediction = model.predict(comment_vec)[0]

        return success_response(
            message="Sentiment predicted successfully",
            data={"comment": comment, "sentiment": prediction}
        )

    except Exception as e:
        return error_response(
            message=f"Error occurred while predicting sentiment: {str(e)}",
            status_code=500
        )
