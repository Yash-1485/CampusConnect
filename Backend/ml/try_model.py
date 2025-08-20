import joblib

model = joblib.load('sentiment_model.joblib')
vectorizer = joblib.load('tfidf_vectorizer.joblib')

x_test = ["The place was amazing and clean", "Worst experience ever, dirty rooms", "The place was okay"]

x_test_vec = vectorizer.transform(x_test)

y_pred = model.predict(x_test_vec)

print(list(y_pred))