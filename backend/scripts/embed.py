import os
import sys
from pathlib import Path
from typing import List, Dict
from dotenv import load_dotenv

# Add parent directory to path to import from db
sys.path.append(str(Path(__file__).parent.parent))

from pinecone import Pinecone
from langchain_openai import OpenAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from scraper import scrape_webpage, download_pdf
from chunker import chunk_documents

load_dotenv()

# Initialize clients
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small",
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

INDEX_NAME = "hack-earth"

def get_or_create_index():
    existing_indexes = [index.name for index in pc.list_indexes()]
    
    if INDEX_NAME not in existing_indexes:
        print(f"Creating index {INDEX_NAME}...")
        pc.create_index(
            name=INDEX_NAME,
            dimension=1536,  # text-embedding-3-small dimension
            metric="cosine",
            spec={"serverless": {"cloud": "aws", "region": "us-east-1"}}
        )
    
    return pc.Index(INDEX_NAME)

def process_austin_energy_pages() -> List[Dict]:
    urls = [
        "https://savings.austinenergy.com/residential/offerings/home-improvements/instant-savings",
        "https://savings.austinenergy.com/residential/offerings/cooling-and-heating/ac",
        "https://savings.austinenergy.com/residential/offerings/appliances-and-equipment/hp-water-heater",
        "https://savings.austinenergy.com/residential/offerings/cooling-and-heating/pp-thermostat"
    ]
    
    documents = []
    for url in urls:
        print(f"Scraping {url}...")
        result = scrape_webpage(url)
        if result["text"]:
            documents.append({
                "text": result["text"],
                "source": "austin_energy",
                "location": "austin_tx",
                "zip_codes": ["78701", "78702", "78703", "78704", "78705"],
                "type": "utility_rebate",
                "url": url,
                "title": result["title"]
            })
    
    return documents

def process_energy_gov_pages() -> List[Dict]:
    urls = [
        "https://www.energy.gov/save/home-upgrades"
    ]
    
    documents = []
    for url in urls:
        print(f"Scraping {url}...")
        result = scrape_webpage(url)
        if result["text"]:
            documents.append({
                "text": result["text"],
                "source": "energy_gov",
                "location": "federal",
                "type": "federal_program_info",
                "category": "general",
                "url": url,
                "title": result["title"]
            })
    
    return documents

def process_irs_5695() -> List[Dict]:
    pdf_path = "irs_5695_2024.pdf"
    pdf_url = "https://www.irs.gov/pub/irs-pdf/i5695.pdf"
    
    if not os.path.exists(pdf_path):
        print(f"Downloading IRS Form 5695 instructions...")
        download_pdf(pdf_url, pdf_path)
    
    documents = []
    if os.path.exists(pdf_path):
        print(f"Processing {pdf_path}...")
        loader = PyPDFLoader(pdf_path)
        pages = loader.load()
        
        # Combine all pages into one document
        full_text = "\n\n".join([page.page_content for page in pages])
        
        documents.append({
            "text": full_text,
            "source": "irs_5695",
            "location": "federal",
            "type": "federal_tax_credit",
            "year": "2024",
            "title": "2024 Instructions for Form 5695"
        })
    
    return documents

def embed_and_upsert(documents: List[Dict], index):
    print(f"Chunking {len(documents)} documents...")
    chunks = chunk_documents(documents)
    
    print(f"Generated {len(chunks)} chunks. Embedding and upserting...")
    
    # Process in batches
    batch_size = 100
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i + batch_size]
        
        texts = [chunk["text"] for chunk in batch]
        batch_embeddings = embeddings.embed_documents(texts)
        
        vectors = []
        for j, (chunk, embedding) in enumerate(zip(batch, batch_embeddings)):
            vector_id = f"{chunk['metadata'].get('source', 'unknown')}_{i+j}"
            vectors.append({
                "id": vector_id,
                "values": embedding,
                "metadata": {
                    **chunk["metadata"],
                    "text": chunk["text"][:1000]  # Store first 1000 chars in metadata
                }
            })
        
        index.upsert(vectors=vectors)
        print(f"Upserted batch {i//batch_size + 1}/{(len(chunks) + batch_size - 1)//batch_size}")
    
    print(f"✅ Successfully embedded and upserted {len(chunks)} chunks!")

def main():
    print("Starting RAG embedding pipeline...")
    
    index = get_or_create_index()
    
    all_documents = []
    
    print("\n=== Processing Austin Energy ===")
    all_documents.extend(process_austin_energy_pages())
    
    print("\n=== Processing Energy.gov ===")
    all_documents.extend(process_energy_gov_pages())
    
    print("\n=== Processing IRS Form 5695 ===")
    all_documents.extend(process_irs_5695())
    
    print(f"\n=== Embedding and Uploading ===")
    embed_and_upsert(all_documents, index)
    
    print("\n🎉 All done!")

if __name__ == "__main__":
    main()
