# CampusConnect 🎓
A **campus community platform** designed to help students connect, share, and discover resources. CampusConnect enables users to **find listings** (PGs, hostels, mess, tiffin, tutors, etc.), interact with peers. 

---

## 🚀 Features  

- **User Authentication** 🔐  
  - Secure signup/login with a custom Django user model  
  - JWT-based authentication  

- **Listings** 🏠📚🍱  
  - Create, update, and manage listings (PGs, hostels, mess, tiffin, tutors)  
  - Rich listing details: pricing, amenities, food options, gender preference, occupancy, and availability  
  - Upload and manage multiple images per listing (Cloudinary integration)  

- **Machine Learning Integration** 🤖
  - **Sentiment Analysis**: Analyzes user reviews for quality insights  

- **Search & Filter** 🔍  
  - Powerful search by location, price, category, or amenities  
  - Sorting and filtering for a smooth browsing experience  

- **Responsive Frontend** 💻📱  
  - Built with **React + Tailwind CSS**  
  - Clean, modern UI with smooth navigation  

---

## 🛠️ Tech Stack  

**Frontend**: React, Tailwind CSS, ShadCN, Framer Motion  
**Backend**: Django, Django REST Framework  
**Database**: SQLite
**Authentication**: JWT  
**Machine Learning**: Sentiment analysis models    

---

## ⚙️ Installation & Setup  

### 1. Clone the repository  
```bash
git clone https://github.com/Yash-1485/CampusConnect.git
cd CampusConnect
```

### 2. Backend Setup (Django)  
```bash
cd backend
python -m venv .venv
.venv/Scripts/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup (React)  
```bash
cd frontend
npm install
npm run dev
```

---

## 🔮 Future Enhancements  

- Chat system for students and providers  
- Advanced recommendation engine (collaborative filtering)  
- Booking & payment integration  
- Mobile app (React Native)  

---
