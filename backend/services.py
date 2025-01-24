from llama_index.core import VectorStoreIndex
from llama_index.core.schema import Document
from sentence_transformers import SentenceTransformer
import fitz

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text("text")
    return text

def generate_answer(question, document_text):
    # Use a local sentence transformer model for embedding
    embed_model = SentenceTransformer('all-MiniLM-L6-v2')
    
    # Convert the text into LlamaIndex Document format
    document = Document(text=document_text)
    
    # Create an index from the document 
    # Use the embedding model's embed_query method
    index = VectorStoreIndex.from_documents(
        [document], 
        embed_model=embed_model.encode
    )
    
    query_engine = index.as_query_engine()
    
    # Generate an answer to the question
    response = query_engine.query(question)
    
    # Return the response's answer
    return response.response

# Example usag