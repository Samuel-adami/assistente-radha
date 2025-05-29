import json
from typing import Optional
from jose import jwt
from datetime import datetime, timedelta

# ⚙️ Configuração do JWT
SECRET_KEY = "radha-super-secreto"  # Substitua por algo seguro em produção
ALGORITHM = "HS256"
EXPIRATION_MINUTES = 60

# 🔍 Carregar usuários do JSON
def carregar_usuarios():
    with open("users.json", "r", encoding="utf-8") as f:
        return json.load(f)

# ✅ Validar login
def autenticar(email: str, senha: str) -> Optional[dict]:
    usuarios = carregar_usuarios()
    for user in usuarios:
        if user["email"] == email and user["senha"] == senha:
            return user
    return None

# 🧾 Gerar token
def criar_token(usuario: dict) -> str:
    payload = {
        "sub": usuario["email"],
        "nome": usuario["nome"],
        "cargo": usuario["cargo"],
        "exp": datetime.utcnow() + timedelta(minutes=EXPIRATION_MINUTES)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

# 🔍 Decodificar token
def decodificar_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except Exception:
        return None