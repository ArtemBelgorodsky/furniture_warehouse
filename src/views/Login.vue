<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <div class="w-full max-w-md p-8 bg-card rounded-lg border border-border shadow-lg">
      <h2 class="text-2xl font-bold text-center mb-6">Вход в систему</h2>
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Логин</label>
          <input v-model="form.login" type="text" class="w-full rounded-lg border border-border bg-input px-3 py-2 outline-none focus:border-primary" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Пароль</label>
          <input v-model="form.password" type="password" class="w-full rounded-lg border border-border bg-input px-3 py-2 outline-none focus:border-primary" required />
        </div>
        <button type="submit" class="w-full rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90">Войти</button>
      </form>
      <p class="text-sm text-muted-foreground mt-4 text-center">
        Логин: admin<br>
        Пароль: admin
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  login: '',
  password: ''
})

const emit = defineEmits<{
  loginSuccess: []
}>()

const login = () => {
  if (form.value.login === 'admin' && form.value.password === 'admin') {
    emit('loginSuccess')
  } else {
    alert('Неверный логин или пароль')
  }
}
</script>