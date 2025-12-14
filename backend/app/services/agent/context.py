from contextvars import ContextVar
from typing import Optional, Dict, Any

# Global context variable to store the current user
# This allows us to access the user in tools without passing it through every function
user_context_var: ContextVar[Optional[Dict[str, Any]]] = ContextVar("user_context", default=None)
