<template>
  <div class="rounded-lg border border-border bg-card p-4">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm text-muted-foreground">{{ title }}</p>
        <p class="mt-1 text-2xl font-bold">{{ value }}</p>
        <p class="mt-2 text-xs text-muted-foreground">{{ trend }}</p>
      </div>
      <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
        <component :is="getIcon(icon)" class="h-5 w-5 text-accent" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Package, Box, MapPin, Percent, BarChart3, TrendingUp, AlertCircle } from 'lucide-vue-next'

defineProps<{
  title: string
  value: string | number
  icon: string
  trend: string
}>()

const getIcon = (icon: string) => {
  const icons: Record<string, any> = {
    'package': Package,
    'box': Box,
    'map': MapPin,
    'percent': Percent,
    'chart': BarChart3,
    'trending': TrendingUp,
    'alert-circle': AlertCircle
  }
  return icons[icon] || Package
}
</script>
