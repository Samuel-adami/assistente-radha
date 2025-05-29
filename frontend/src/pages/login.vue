<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="Usuário" required />
      <input v-model="password" type="password" placeholder="Senha" required />
      <button type="submit">Entrar</button>
    </form>
    <p v-if="erro" class="erro">{{ erro }}</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      username: '',
      password: '',
      erro: ''
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('/auth/login', {
          username: this.username,
          password: this.password
        })

        const { nome, mensagem_boas_vindas } = response.data
        localStorage.setItem('usuario', JSON.stringify({
          username: this.username,
          password: this.password,
          nome,
          cargo: mensagem_boas_vindas.split('como ')[1]?.replace('.', '')
        }))
        
        alert(mensagem_boas_vindas)
        this.$router.push('/dashboard') // ou onde for a tela principal
      } catch (err) {
        this.erro = err.response?.data?.detail || 'Erro ao fazer login.'
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  max-width: 300px;
  margin: 100px auto;
  text-align: center;
}
input {
  display: block;
  margin: 10px auto;
  padding: 8px;
  width: 100%;
}
.erro {
  color: red;
  margin-top: 10px;
}
</style>