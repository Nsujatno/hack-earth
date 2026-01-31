import os
from langchain_openai import OpenAIEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from pinecone import Pinecone
from tavily import TavilyClient
from dotenv import load_dotenv

load_dotenv()

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("hack-earth")

embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small",
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-preview-09-2025",
    temperature=0,
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

llm_flash_lite = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash-lite",
    temperature=0,
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

def retrieve_context(query: str, filters=None, k=5) -> str:
    """
    Retrieve relevant documents from Pinecone.
    """
    try:
        # Embed the query
        query_embedding = embeddings.embed_query(query)
        
        # Query Pinecone
        results = index.query(
            vector=query_embedding,
            top_k=k,
            include_metadata=True,
            filter=filters
        )
        
        contexts = []
        for match in results['matches']:
            contexts.append(f"""
Source: {match.metadata.get('source')}
Type: {match.metadata.get('type')}
URL: {match.metadata.get('url', 'N/A')}
Content: {match.metadata.get('text')}

            """)
        
        return "\n\n".join(contexts)
    except Exception as e:
        print(f"Retrieval Error: {e}")
        return ""

def check_zip_coverage(zip_code: str) -> bool:
    """
    Check if we have local utility data for this zip code in Pinecone.
    """
    try:
        dummy_vec = embeddings.embed_query("utility rebate")
        
        results = index.query(
            vector=dummy_vec,
            top_k=1,
            include_metadata=False,
            filter={
                "zip_codes": {"$in": [zip_code]},
                "type": "utility_rebate"
            }
        )
        
        has_coverage = len(results['matches']) > 0
        print(f"Zip Coverage Check ({zip_code}): {'✅ Found' if has_coverage else '❌ Not Found'}")
        return has_coverage
    except Exception as e:
        print(f"Coverage Check Error: {e}")
        return False

def search_web(query: str) -> str:
    """
    Search the web using Tavily.
    """
    print(f"🌍 Searching web for: {query}")
    try:
        response = tavily.search(query=query, search_depth="advanced")
        context = []
        for result in response.get('results', [])[:3]:
            context.append(f"Source: {result['url']}\nContent: {result['content']}")
        return "\n\n".join(context)
    except Exception as e:
        print(f"Tavily search failed: {e}")
        return ""
