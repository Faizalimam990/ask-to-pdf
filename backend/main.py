import os
import uuid
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

import fitz
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain_community.llms import HuggingFacePipeline

# Database and App Setup
Base = declarative_base()
engine = create_engine('sqlite:///pdf_qa.db')
SessionLocal = sessionmaker(bind=engine)

class Document(Base):
   __tablename__ = 'documents'
   id = Column(String, primary_key=True)
   filename = Column(String)
   uploaded_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(engine)

# Model and Embedding Setup
model_name = "facebook/opt-350m"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# Configure generation pipeline
text_generation_pipeline = pipeline(
   "text-generation", 
   model=model, 
   tokenizer=tokenizer,
   max_length=500,
   do_sample=True,
   top_k=50,
   top_p=0.95
)

# Initialize App
app = FastAPI()
app.add_middleware(
   CORSMiddleware,
   allow_origins=["http://localhost:3000"],
   allow_credentials=True,
   allow_methods=["*"],
   allow_headers=["*"],
)

# Ensure uploads directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# NLP Setup
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
llm = HuggingFacePipeline(pipeline=text_generation_pipeline)

processed_documents = {}

def extract_text_from_pdf(pdf_path):
   doc = fitz.open(pdf_path)
   return " ".join(page.get_text() for page in doc)

def process_document_for_qa(text):
   text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
   texts = text_splitter.split_text(text)
   return FAISS.from_texts(texts, embeddings)

def generate_answer(question, vectorstore):
   qa_chain = RetrievalQA.from_chain_type(
       llm, 
       retriever=vectorstore.as_retriever(),
       return_source_documents=False
   )
   return qa_chain({"query": question})['result']

@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...)):
   document_id = str(uuid.uuid4())
   file_path = os.path.join(UPLOAD_DIR, f"{document_id}_{file.filename}")
   
   with open(file_path, "wb") as f:
       f.write(await file.read())
   
   extracted_text = extract_text_from_pdf(file_path)
   vectorstore = process_document_for_qa(extracted_text)
   
   processed_documents[document_id] = {
       'vectorstore': vectorstore,
       'filename': file.filename
   }
   
   return {"document_id": document_id, "message": "Upload successful"}

@app.post("/ask/")
async def ask_question(question: str = Form(...), filename: str = Form(...)):
   if filename not in processed_documents:
       return {"error": "Document not found"}
   
   vectorstore = processed_documents[filename]['vectorstore']
   answer = generate_answer(question, vectorstore)
   
   return {"answer": answer}