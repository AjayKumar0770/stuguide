import os
from supabase import create_client, Client

def get_supabase_client() -> Client:
    """
    Create and return a Supabase client instance.
    Uses service key for backend operations.
    """
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    
    if not supabase_url or not supabase_key:
        raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set")
    
    return create_client(supabase_url, supabase_key)

# Create a singleton instance
supabase: Client = get_supabase_client()
