# 📚 Ask-to-PDF: AI-Powered PDF Q&A App

![Ask-to-PDF](https://framerusercontent.com/images/pFpeWgK03UT38AQl5d988Epcsc.svg?scale-down-to=512)

🚀 **Ask-to-PDF** is an AI-powered application that allows users to upload PDFs and ask questions about their content. Built using **React** for the frontend and **FastAPI** with **SQLite** for the backend, this app provides an interactive way to extract and query PDF documents efficiently.

## 🌟 Features

✅ Upload PDFs effortlessly
✅ AI-driven Q&A system based on document content
✅ Fast and efficient document processing
✅ User-friendly interface with Material-UI
✅ RESTful API with FastAPI
✅ Local embedding model support

---

## 📂 Project Structure

```
ask-to-pdf/
├── Backend/
│   ├── main.py          # FastAPI backend
│   ├── services.py      # PDF processing and AI logic
│   ├── uploads/        # Uploaded PDFs
├── frontend/
│   ├── frontend/src/   # React frontend
│   ├── App.js          # Main React component
│   ├── index.js        # React entry point
│   ├── styles.css      # UI Styling
├── README.md           # Project Documentation
```

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository
```sh
$ git clone https://github.com/Faizalimam990/ask-to-pdf.git
$ cd ask-to-pdf
```

### 2️⃣ Backend Setup (FastAPI & SQLite)
```sh
$ cd Backend
$ python -m venv venv
$ source venv/bin/activate  # On Windows use `venv\Scripts\activate`
$ pip install -r requirements.txt
$ uvicorn main:app --reload
```

### 3️⃣ Frontend Setup (React)
```sh
$ cd frontend/frontend
$ npm install
$ npm start
```

---

## ⚡ Usage Guide

1️⃣ **Upload a PDF** 📝  
   - Click on the upload section and select a PDF file.

2️⃣ **Ask a Question** ❓  
   - Type a question related to the document and submit.

3️⃣ **Get an Answer** 💡  
   - The AI model will process the document and provide a response.

---

## 🛠️ Built With

- **Frontend:** React, Material-UI, Axios
- **Backend:** FastAPI, SQLite, LlamaIndex
- **AI Model:** Local embeddings

---

## 🤝 Contributing
Feel free to submit issues or pull requests if you have improvements or ideas!

---

## 📜 License
This project is open-source and available under the MIT License.

---

🚀 **Happy Coding!** 🎉

