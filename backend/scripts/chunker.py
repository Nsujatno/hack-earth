from langchain_text_splitters import RecursiveCharacterTextSplitter
from typing import List, Dict

def chunk_text(text: str, chunk_size: int = 1000, chunk_overlap: int = 200) -> List[str]:
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
        separators=["\n\n", "\n", ". ", " ", ""]
    )
    
    chunks = text_splitter.split_text(text)
    return chunks

def chunk_documents(documents: List[Dict[str, str]], chunk_size: int = 1000, chunk_overlap: int = 200) -> List[Dict]:
    all_chunks = []
    
    for doc in documents:
        text = doc.get("text", "")
        metadata = {k: v for k, v in doc.items() if k != "text"}
        
        chunks = chunk_text(text, chunk_size, chunk_overlap)
        
        for i, chunk in enumerate(chunks):
            all_chunks.append({
                "text": chunk,
                "metadata": {
                    **metadata,
                    "chunk_index": i,
                    "total_chunks": len(chunks)
                }
            })
    
    return all_chunks
