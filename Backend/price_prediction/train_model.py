import os
from pathlib import Path
import django
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Backend.settings")
# django.setup()

#import Listings model

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "saved_models"
MODEL_DIR.mkdir(exist_ok=True)

FIELDS = [
    "category", "location_city", "location_state", "room_type", "occupancy_limit", "gender_preference", "food_included", "is_furnished", "amenities", "availability", "rating", "price"
]

AMENITIES = [
    "wifi","ac","laundry","attached_bathroom","meals","housekeeping",
    "parking","cctv","study_table","wardrobe","water","security",
    "power_backup","fridge","tv","geyser"
]

FEATURE_CONFIG = {
    "pg": ["location_city", "location_state", "room_type", "occupancy_limit", "gender_preference", "food_included",
           "is_furnished", "rating"] + [
               "wifi", "ac", "laundry", "attached_bathroom", "meals",
               "housekeeping", "parking", "cctv", "study_table", "wardrobe",
               "water", "security", "power_backup", "fridge", "tv", "geyser"
           ],
    "hostel": ["location_city", "location_state", "room_type", "occupancy_limit", "gender_preference", "food_included",
               "is_furnished", "rating"] + [
               "wifi", "ac", "laundry", "attached_bathroom", "meals",
               "housekeeping", "parking", "cctv", "study_table", "wardrobe",
               "water", "security", "power_backup", "fridge", "tv", "geyser"
           ],
    "mess": ["location_city", "location_state", "food_included", "rating"],
    "tiffin": ["location_city", "location_state", "food_included", "rating"],
    "tutor": ["location_city", "location_state", "rating"]
}

# def fetch_listings(): to fetch all listings from model
#     listings = Listing.objects.all().values(*FIELDS)   
#     df = pd.DataFrame(list(listings))
#     return df

data_path = BASE_DIR / "data/dummy_data.csv"
df = pd.read_csv(data_path)

def expand_amenities(df): 
    df['amenities'] = df['amenities'].fillna("")
    
    for amenity in AMENITIES:
        df[amenity] = df["amenities"].apply(lambda v: 1 if amenity in str(v) else 0) #making seperate columns for each amenity
    df = df.drop(columns=['amenities'])
    return df


def clean_data(df): #cleaning the data
    df['location_city'] = df['location_city'].fillna("Unknown")
    df['location_state'] = df['location_state'].fillna("Unknown")
    df['room_type'] = df['room_type'].fillna("Unknown")
    df['gender_preference'] = df['gender_preference'].fillna("any")
    df['category'] = df['category'].fillna("pg")
    df['food_included'] = df['food_included'].astype(bool)
    df['is_furnished'] = df['is_furnished'].astype(bool)
    df['occupancy_limit'] = df['occupancy_limit'].fillna(0)
    df['rating'] = df['rating'].fillna(0.0)

    return df

def train_model(df_category,category_name):
    #Trains model separately for each category
    features = FEATURE_CONFIG[category_name]
    x = df_category[features]
    y = df_category["price"]
    categorical_cols = x.select_dtypes(include=["object"]).columns.tolist()
    # numeric_cols = x.select_dtypes(exclude=["object"]).columns.tolist()
    preprocessor = ColumnTransformer( #for one-hot-encoding
        transformers=[("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_cols)],
        remainder="passthrough"
    )
    pipeline = Pipeline([ #chains methods together
        ("preproc", preprocessor), #for preprocessing
        ("rf", RandomForestRegressor(n_estimators=100, n_jobs=-1, random_state=42)) #the model, n_estimators is the number of decision trees
    ])
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)
    pipeline.fit(x_train, y_train)

    model_path = MODEL_DIR / f"price_model_{category_name}.pkl"
    joblib.dump(pipeline, model_path)
    print(f"Model for {category_name} is saved at {model_path}")


if __name__ == "__main__":
    # df = fetch_listings()
    df = expand_amenities(df)
    df = clean_data(df)
    # train per category
    for cat in df["category"].dropna().unique():
        df_cat = df[df["category"] == cat].copy()
        if df_cat.shape[0] < 10:
            print(f"Skipping {cat} — not enough rows ({df_cat.shape[0]})")
            continue
        train_model(df_cat, cat)