# 📝 BlogPlatform

A full-stack blogging platform built with **React**, **Django REST Framework**, and **Tailwind CSS** — offering a modern UI with powerful blog and user interaction features.

## 🚀 Features

- 🔐 User Authentication (Register, Login, Logout)
- 👤 Profile View & Edit
- 📝 Blog Management (Create, Edit, Delete, View)
- 💬 Comment System (Add, Edit, Delete)
- ❤️ Like & 🔖 Bookmark Blogs
- 🔍 Blog Search & Filter
- 🔔 Notification System (e.g., for comments or likes)
- 🖼️ Image Upload Support for Blogs

> 📌 All features are powered by **REST APIs**, including blogs, comments, likes, bookmarks, profile updates, and notifications.

## 🛠️ Tech Stack

**Frontend**  
- React (Create React App)  
- Axios for API requests  
- React Router DOM  
- Tailwind CSS  

**Backend**  
- Django & Django REST Framework  
- Token Authentication  
- SQLite (easily swappable with PostgreSQL)  

## ⚙️ Setup Guide

### Backend

```bash
cd backend
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## ✨ Author

Built with ❤️ by [Sreerag Sreekanth](https://github.com/SreeragSreekanth)
