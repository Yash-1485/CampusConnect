import joblib
import pandas as pd
from train_model import expand_amenities

model = joblib.load("saved_models/price_model_pg.pkl") 

sample = pd.DataFrame([{
    "room_type": "single",
    "occupancy_limit": 1,
    "gender_preference": "any",
    "food_included": True,
    "is_furnished": True,
    "amenities": ["wifi", "ac", "laundry"],
    "location_city": "Ahmedabad",
    "location_state": "Gujarat",
    "rating": 4.5
}])

sample = expand_amenities(sample)

predicted_price = model.predict(sample)
print("Predicted Price:", predicted_price[0])