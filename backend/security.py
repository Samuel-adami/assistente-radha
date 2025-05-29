# backend/security.py

from fastapi import Header, HTTPException, Depends
from typing import List
import json
import os

USERS_FILE = os.path.join(os.path.dirname(__file__), "users.json")

def verificar_autenticacao(cargos_permitidos: List[str]):
    def verificar(authorization: str = Header(...)):
        try:
            username, password = authorization.split(":")
        except ValueError:
            raise HTTPException(status_code=401, detail="Formato inválido de autenticação. Use 'username:senha'.")

        if not os.path.exists(USERS_FILE):
            raise HTTPException(status_code=500, detail="Arquivo de usuários não encontrado.")

        with open(USERS_FILE, "r", encoding="utf-8") as f:
            users = json.load(f)

        user = next((u for u in users if u["username"] == username and u["password"] == password), None)

        if not user:
            raise HTTPException(status_code=403, detail="Credenciais inválidas.")

        if user["cargo"] not in cargos_permitidos:
            raise HTTPException(status_code=403, detail="Permissão insuficiente para esta rota.")

        return user  # Retorna o dicionário do usuário autenticado
    return verificar