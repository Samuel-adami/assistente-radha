# routes/auth.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
import os

router = APIRouter(prefix="/auth", tags=["Autenticação"])

USERS_FILE = os.path.join(os.path.dirname(__file__), "../users.json")

class LoginInput(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(input: LoginInput):
    try:
        with open(USERS_FILE, "r", encoding="utf-8") as f:
            users = json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Arquivo de usuários não encontrado.")

    user = next((u for u in users if u["username"] == input.username and u["password"] == input.password), None)

    if not user:
        raise HTTPException(status_code=401, detail="Usuário ou senha inválidos.")

    primeiro_nome = user["nome"].split()[0]
    saudacao = f"Bem-vindo(a), {primeiro_nome}! Você está logado como {user['cargo']}."

    return {
        "nome": primeiro_nome,
        "mensagem_boas_vindas": saudacao
    }