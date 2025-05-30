from fastapi import APIRouter, HTTPException, Request
from services import auth_service

router = APIRouter()

@router.post("/login")
async def login(request: Request):
    body = await request.json()
    username = body.get("username")
    password = body.get("password")

    if not username or not password:
        raise HTTPException(status_code=400, detail="Usuário e senha são obrigatórios")

    user = auth_service.authenticate_user(username, password)
    if not user:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    return auth_service.create_access_token(user)
