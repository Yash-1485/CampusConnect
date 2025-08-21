from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import pandas as pd
import joblib
from .train_model import expand_amenities, FEATURE_CONFIG

@csrf_exempt
def predict_price(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            category = data.get("category")
            model_path = f"price_prediction/saved_models/price_model_{category}.pkl"

            model = joblib.load(model_path)

            df = pd.DataFrame([data.get("choices")])

            df = expand_amenities(df)

            features = FEATURE_CONFIG[category]
            df = df[features]

            predicted_price = model.predict(df)[0]

            return JsonResponse({"predicted_price": round(predicted_price, 2)})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)