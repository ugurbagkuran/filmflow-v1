from fastapi import APIRouter, HTTPException, Body, Depends
from app.services.auth.utils import get_current_user

from app.services.agent.service import agent_service
from app.services.agent.context import user_context_var
from .schemas import ChatResponse, ChatRequest

router = APIRouter()

# --- Sohbet Endpoint'i ---
@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest = Body(...), current_user=Depends(get_current_user)):
    """
    AI Ajanı ile sohbet etmek için kullanılır.
    Frontend, kullanıcının son mesajını ve (varsa) geçmiş mesajları gönderir.
    """
    try:
        # Pydantic modelini dict listesine çevir (LangChain servisi için)
        chat_history = [msg.model_dump() for msg in request.history]
        
        # ContextVar ile kullanıcıyı ayarla
        token = user_context_var.set(current_user)
        
        try:
            # Ajanı çalıştır
            ai_response = await agent_service.chat(
                user_input=request.message,
                chat_history=chat_history
            )
        finally:
            # Context'i temizle
            user_context_var.reset(token)
        
        return ChatResponse(response=ai_response)

    except Exception as e:
        print(f"Agent Hatası: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))