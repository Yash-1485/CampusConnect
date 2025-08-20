import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
import joblib

data = pd.read_csv('data/dummy_review_data.csv')

x = data['comment'] #predicts on the basis of the words of the comment
y = data['sentiment']

x_train,x_test,y_train,y_test = train_test_split(x,y,test_size=0.2,random_state=42)


# TF-IDF stands for Term Frequency - Inverse Document Frequency.
# It converts text into numerical vectors that ML models can understand.
# It highlights words that are important in a document but not common across all documents.
# This helps the model focus on meaningful words rather than common ones like "the", "and", "is".

vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
# stop_words='english': removes common English words like “the”, “a”, “in”, etc.
# max_features=5000: limits the vocabulary size to the 5000 most important words by TF-IDF score
x_train_vec = vectorizer.fit_transform(x_train) #returns matrix of idf score of words
x_test_vec = vectorizer.transform(x_test)

model = LogisticRegression(max_iter=1000) #learns patterns and predicts which words lead to what kind of sentiment
model.fit(x_train_vec, y_train)

y_pred = model.predict(x_test_vec)

print("Accuracy:", accuracy_score(y_test, y_pred))
print("Classification Report:\n", classification_report(y_test, y_pred))

joblib.dump(model, 'sentiment_model.joblib')
joblib.dump(vectorizer, 'tfidf_vectorizer.joblib')