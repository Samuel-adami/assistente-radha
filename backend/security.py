# backend/security.py

from fastapi import Header, HTTPException
import json
import os

USERS_FILE = os.path.join(os.path.dirname(__file__), "users.json")

def verificar_autenticacao(cargos_permitidos: list):
    def verificar(authorization: str = Header(...)):
        try:
            username, password = authorization.split(":")
        except:
            raise HTTPException(status_code=401, detail="Formato inválido de autenticação. Use 'username:senha'.")

        try:
            with open(USERS_FILE, "r", encoding="utf-8") as f:
                users = json.load(f)
        except FileNotFoundError:
            raise HTTPException(status_code=500, detail="Arquivo de usuários não encontrado.")

        user = next((u for u in users if u["username"] == username and u["password"] == password), None)

        if not user:
            raise HTTPException(status_code=403, detail="Credenciais inválidas.")

        if user["cargo"] not in cargos_permitidos:
            raise HTTPException(status_code=403, detail="Permissão insuficiente para esta rota.")

        return user
    return verificar