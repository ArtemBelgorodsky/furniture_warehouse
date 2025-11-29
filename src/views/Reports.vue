<template>
  <div class="space-y-6">
    <h2 class="text-3xl font-bold">Отчеты и аналитика</h2>

    <!-- Report Types -->
    <div class="grid gap-4 md:grid-cols-3">
      <button 
        v-for="report in reportTypes" 
        :key="report.id"
        @click="selectedReport = report.id"
        :class="['rounded-lg border-2 p-4 text-left transition-colors', 
          selectedReport === report.id 
            ? 'border-primary bg-primary/10' 
            : 'border-border hover:border-primary']"
      >
        <component :is="report.icon" class="mb-2 h-6 w-6 text-accent" />
        <h3 class="font-semibold">{{ report.name }}</h3>
        <p class="text-sm text-muted-foreground">{{ report.description }}</p>
      </button>
    </div>

    <!-- Report Content -->
    <div class="rounded-lg border border-border bg-card p-6">
      <!-- Inventory Report -->
      <div v-if="selectedReport === 'inventory'" class="space-y-4">
        <h3 class="text-xl font-semibold mb-4">Отчет по инвентарю</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="border-b border-border">
              <tr>
                <th class="px-4 py-2 text-left font-medium">Название</th>
                <th class="px-4 py-2 text-left font-medium">SKU</th>
                <th class="px-4 py-2 text-left font-medium">Количество</th>
                <th class="px-4 py-2 text-left font-medium">Статус</th>
                <th class="px-4 py-2 text-left font-medium">Локация</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in inventory.furniture" :key="item.id" class="border-b border-border/50 hover:bg-secondary/50">
                <td class="px-4 py-2">{{ item.name }}</td>
                <td class="px-4 py-2 text-muted-foreground">{{ item.sku }}</td>
                <td class="px-4 py-2 font-semibold">{{ item.quantity }}</td>
                <td class="px-4 py-2">
                  <span :class="['rounded-full px-2 py-1 text-xs', getStatusColor(item.status)]">
                    {{ getStatusLabel(item.status) }}
                  </span>
                </td>
                <td class="px-4 py-2 text-muted-foreground">{{ item.location }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Shipment Report -->
      <div v-if="selectedReport === 'shipments'" class="space-y-4">
        <h3 class="text-xl font-semibold mb-4">Отчет по отгрузкам</h3>
        <div class="grid gap-4 mb-4">
          <div class="flex items-center justify-between p-3 bg-secondary rounded-lg">
            <span>Всего отгрузок:</span>
            <span class="font-semibold text-lg">{{ inventory.shipments.length }}</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-secondary rounded-lg">
            <span>Отправлено:</span>
            <span class="font-semibold text-lg text-red-400">{{ shipmentStats.sent }}</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-secondary rounded-lg">
            <span>В обработке:</span>
            <span class="font-semibold text-lg text-red-500">{{ shipmentStats.processing }}</span>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="border-b border-border">
              <tr>
                <th class="px-4 py-2 text-left font-medium">Мебель</th>
                <th class="px-4 py-2 text-left font-medium">Адресат</th>
                <th class="px-4 py-2 text-left font-medium">Кол-во</th>
                <th class="px-4 py-2 text-left font-medium">Дата</th>
                <th class="px-4 py-2 text-left font-medium">Статус</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="shipment in inventory.shipments" :key="shipment.id" class="border-b border-border/50 hover:bg-secondary/50">
                <td class="px-4 py-2">{{ getFurnitureName(shipment.furnitureId) }}</td>
                <td class="px-4 py-2">{{ shipment.destination }}</td>
                <td class="px-4 py-2 font-semibold">{{ shipment.quantity }}</td>
                <td class="px-4 py-2 text-muted-foreground">{{ new Date(shipment.createdAt).toLocaleDateString('ru-RU') }}</td>
                <td class="px-4 py-2">
                  <span :class="['rounded-full px-2 py-1 text-xs', getShipmentStatusColor(shipment.status)]">
                    {{ getShipmentStatusLabel(shipment.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Storage Report -->
      <div v-if="selectedReport === 'storage'" class="space-y-4">
        <h3 class="text-xl font-semibold mb-4">Отчет по хранилищам</h3>
        <div class="space-y-3">
          <div v-for="location in inventory.locations" :key="location.id" class="p-4 border border-border rounded-lg">
            <div class="flex items-center justify-between mb-2">
              <span class="font-semibold">{{ location.name }}</span>
              <span class="text-sm text-muted-foreground">{{ Math.round((location.currentLoad / location.capacity) * 100) }}%</span>
            </div>
            <div class="h-2 w-full rounded-full bg-secondary">
              <div class="h-full rounded-full bg-accent" :style="{ width: `${(location.currentLoad / location.capacity) * 100}%` }"></div>
            </div>
            <p class="text-xs text-muted-foreground mt-2">{{ location.currentLoad }} / {{ location.capacity }} единиц</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useInventoryStore } from '../stores/inventory'
import { BarChart3, TrendingUp, LayoutGrid, Download, Package, Truck, MapPin } from 'lucide-vue-next'

const inventory = useInventoryStore()
const selectedReport = ref('inventory')

const reportTypes = [
  { id: 'inventory', name: 'Инвентарь', description: 'Полный список товаров', icon: Package },
  { id: 'shipments', name: 'Отгрузки', description: 'История отгрузок', icon: Truck },
  { id: 'storage', name: 'Хранилища', description: 'Использование складов', icon: MapPin }
]

const shipmentStats = computed(() => {
  return {
    sent: inventory.shipments.filter(s => s.status === 'отправлена').length,
    processing: inventory.shipments.filter(s => s.status === 'обработка').length,
    delivered: inventory.shipments.filter(s => s.status === 'доставлена').length
  }
})

const getFurnitureName = (id: string) => {
  return inventory.getFurnitureById(id)?.name || 'Неизвестный товар'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'в_наличии': 'В наличии',
    'зарезервировано': 'Зарезервировано',
    'на_пути': 'На пути'
  }
  return labels[status] || status
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'в_наличии': 'bg-red-100 text-red-800',
    'зарезервировано': 'bg-red-200 text-red-900',
    'на_пути': 'bg-red-300 text-red-900'
  }
  return colors[status] || 'bg-secondary'
}

const getShipmentStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'новая': 'Новая',
    'обработка': 'Обработка',
    'отправлена': 'Отправлена',
    'доставлена': 'Доставлена'
  }
  return labels[status] || status
}

const getShipmentStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'новая': 'bg-red-100 text-red-800',
    'обработка': 'bg-red-200 text-red-900',
    'отправлена': 'bg-red-300 text-red-900',
    'доставлена': 'bg-red-400 text-red-900'
  }
  return colors[status] || 'bg-secondary'
}
</script>
