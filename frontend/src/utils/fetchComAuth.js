// ✅ Novo utilitário: frontend/src/utils/fetchComAuth.js

export async function fetchComAuth(url, options = {}) {
  const auth = localStorage.getItem("auth");

  const headers = {
    ...options.headers,
    Authorization: auth,
    "Content-Type": "application/json"
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}
