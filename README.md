# 🎉 AI Event Theme Generator

## 📌 Project Description

AI Event Theme Generator is a web application developed using Django and Groq AI. It helps users generate a complete event plan by simply entering an event name and theme. The AI creates creative and realistic suggestions for decorations, activities, poster content, tagline, budget, timeline, and checklist. Users can also download the generated event plan as a PDF or copy it to the clipboard.

---

## 🚀 Features

- AI-based Event Planning
- Theme-based Decorations
- Theme-based Activities
- AI-generated Poster Content
- Creative Event Tagline
- Budget Estimation
- Event Timeline
- Event Checklist
- Download Event Plan as PDF
- Copy Event Plan
- Reset Form

---

## 🛠 Technologies Used

### Frontend

- HTML
- CSS
- JavaScript

### Backend

- Python
- Django

### AI Integration

- Groq API
- Llama 3.3 70B Versatile

### PDF Generation

- ReportLab

---

## 📂 Project Structure

```
AI_Event_Theme_Generator/
│
├── event_app/
├── static/
│   ├── css/
│   └── js/
├── templates/
│   └── index.html
├── manage.py
├── requirements.txt
└── README.md
```

---

## ⚙ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/AI_Event_Theme_Generator.git
```

### 2. Go to Project Folder

```bash
cd AI_Event_Theme_Generator
```

### 3. Create Virtual Environment

```bash
python -m venv venv
```

### 4. Activate Virtual Environment

Windows

```bash
venv\Scripts\activate
```

### 5. Install Required Packages

```bash
pip install -r requirements.txt
```

---

## 🔑 Environment Variable

Create a `.env` file in the project folder.

Add your Groq API Key.

```env
GROQ_API_KEY=your_api_key_here
```

---

## ▶ Run the Project

```bash
python manage.py runserver
```

Open your browser and visit:

```
http://127.0.0.1:8000/
```

---

## 📋 How to Use

1. Enter the Event Name.
2. Enter the Event Theme.
3. Click the **Generate** button.
4. Wait for the AI to generate the event plan.
5. View the generated result.
6. Copy the event plan if needed.
7. Download the event plan as a PDF.

---

## 📄 Output Includes

- Event Title
- Decorations
- Activities
- Poster Content
- Tagline
- Budget
- Timeline
- Checklist

---

## 💡 Future Improvements

- User Login System
- Save Event History
- Event Poster Image Generation
- Multiple AI Models
- Email Event Plan
- Share Event Plan
- Database Storage
- Dark Mode
- Multi-language Support

---

## 👩‍💻 Author

**Jessica Shalyn**

Electronics and Communication Engineering 

AI • Python • Django • Full Stack Development

---

## 📜 License

This project is developed for educational and learning purposes.