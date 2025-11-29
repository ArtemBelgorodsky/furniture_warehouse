<template>
  <div v-if="!isLoggedIn" class="min-h-screen bg-background text-foreground">
    <Login @loginSuccess="isLoggedIn = true" />
  </div>
  <div v-else class="min-h-screen bg-background text-foreground">
    <nav class="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div class="flex h-16 items-center justify-between px-6">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m0 0l8 4m0 0l8-4m0 0v10l-8 4m0 0l-8-4m0 0v-10" />
            </svg>
          </div>
          <h1 class="text-xl font-bold">Управление Складом</h1>
        </div>

        <div class="flex items-center gap-6">
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            :class="$route.path === link.path
              ? 'bg-primary text-white'
              : 'text-muted-foreground hover:bg-secondary'"
          >
            <component :is="link.icon" class="h-4 w-4" />
            {{ link.label }}
          </router-link>
        </div>


      </div>
    </nav>

    <main class="p-6">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import Login from './views/Login.vue'
import {
  BarChart3,
  Package,
  MapPin,
  Truck,
  Package2,
  FileText
} from 'lucide-vue-next'

const route = useRoute()
const isLoggedIn = ref(false)

const navLinks = [
  { path: '/', label: 'Панель', icon: BarChart3 },
  { path: '/inventory', label: 'Склад', icon: Package },
  { path: '/locations', label: 'Хранение', icon: MapPin },
  { path: '/shipments', label: 'Отгрузка', icon: Truck },
  { path: '/receipts', label: 'Приемка', icon: Package2 },
  { path: '/reports', label: 'Отчеты', icon: FileText }
]
</script>

<style scoped>
</style>
