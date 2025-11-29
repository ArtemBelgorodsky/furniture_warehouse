<template>
  <div class="space-y-6">
    <h2 class="text-3xl font-bold">Локации хранения</h2>

    <!-- Location Stats -->
    <div class="grid gap-4 md:grid-cols-4">
      <MetricCard
        title="Всего локаций"
        :value="inventory.totalLocations"
        icon="map-pin"
        trend="активных"
      />
      <MetricCard
        title="Среднее заполнение"
        :value="`${Math.round(avgUtilization)}%`"
        icon="percent"
        trend="по всем локациям"
      />
      <MetricCard
        title="Полностью заполнено"
        :value="fullyUtilized"
        icon="alert-circle"
        trend="требуют внимания"
      />
      <MetricCard
        title="Свободное место"
        :value="`${totalCapacity - totalLoad}`"
        icon="box"
        trend="единиц"
      />
    </div>

    <!-- Locations Grid -->
    <div class="grid gap-4 lg:grid-cols-2">
      <div v-for="location in inventory.locations" :key="location.id" class="rounded-lg border border-border bg-card p-4 hover:border-primary transition-colors">
        <div class="flex items-start justify-between mb-3">
          <div>
            <h3 class="text-lg font-semibold">{{ location.name }}</h3>
            <p class="text-sm text-muted-foreground">{{ getTypeLabel(location.type) }}</p>
          </div>
          <span :class="['rounded-full px-3 py-1 text-xs font-medium', getUtilizationColor(location.currentLoad / location.capacity)]">
            {{ Math.round((location.currentLoad / location.capacity) * 100) }}%
          </span>
        </div>

        <!-- Progress Bar -->
        <div class="mb-3">
          <div class="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Заполнено</span>
            <span>{{ location.currentLoad }}/{{ location.capacity }}</span>
          </div>
          <div class="h-2 w-full rounded-full bg-secondary">
            <div class="h-full rounded-full bg-accent transition-all" :style="{ width: `${(location.currentLoad / location.capacity) * 100}%` }"></div>
          </div>
        </div>

        <!-- Items in Location -->
        <div v-if="location.items.length > 0" class="mb-3">
          <p class="text-xs font-medium text-muted-foreground mb-2">Содержит:</p>
          <div class="flex flex-wrap gap-1">
            <span v-for="itemSku in location.items" :key="itemSku" class="inline-block rounded-full bg-secondary px-2 py-1 text-xs">
              {{ itemSku }}
            </span>
          </div>
        </div>

        <button @click="selectedLocation = location; showDetailsModal = true" class="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm hover:bg-secondary/80 transition-colors">
          Просмотр деталей
        </button>
      </div>
    </div>

    <!-- Details Modal -->
    <Modal v-if="showDetailsModal && selectedLocation" @close="showDetailsModal = false" :title="`${selectedLocation.name} - Детали`">
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-muted-foreground">Тип локации</p>
            <p class="font-semibold">{{ getTypeLabel(selectedLocation.type) }}</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Емкость</p>
            <p class="font-semibold">{{ selectedLocation.capacity }} единиц</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Заполнено</p>
            <p class="font-semibold">{{ selectedLocation.currentLoad }} единиц</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Использование</p>
            <p class="font-semibold">{{ Math.round((selectedLocation.currentLoad / selectedLocation.capacity) * 100) }}%</p>
          </div>
        </div>

        <div>
          <p class="text-sm font-medium mb-2">SKU товаров в этой локации:</p>
          <div v-if="selectedLocation.items.length === 0" class="text-center py-4 text-muted-foreground">
            Локация пуста
          </div>
          <div v-else class="space-y-2">
            <div v-for="item in selectedLocation.items" :key="item" class="p-2 bg-secondary rounded-lg text-sm">
              {{ item }}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useInventoryStore, type StorageLocation } from '../stores/inventory'
import MetricCard from '../components/MetricCard.vue'
import Modal from '../components/Modal.vue'

const inventory = useInventoryStore()
const showDetailsModal = ref(false)
const selectedLocation = ref<StorageLocation | null>(null)

const totalCapacity = computed(() => {
  return inventory.locations.reduce((sum, loc) => sum + loc.capacity, 0)
})

const totalLoad = computed(() => {
  return inventory.locations.reduce((sum, loc) => sum + loc.currentLoad, 0)
})

const avgUtilization = computed(() => {
  return (totalLoad.value / totalCapacity.value) * 100
})

const fullyUtilized = computed(() => {
  return inventory.locations.filter(loc => (loc.currentLoad / loc.capacity) > 0.9).length
})

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    'полка': '📦 Полка',
    'стеллаж': '📚 Стеллаж',
    'поддон': '🎯 Поддон',
    'контейнер': '📦 Контейнер'
  }
  return labels[type] || type
}

const getUtilizationColor = (ratio: number) => {
  if (ratio < 0.5) return 'bg-red-100 text-red-800'
  if (ratio < 0.8) return 'bg-red-200 text-red-900'
  return 'bg-red-300 text-red-900'
}
</script>
