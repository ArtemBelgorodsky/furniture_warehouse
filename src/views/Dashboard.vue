<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-3xl font-bold">Панель управления</h2>
    </div>

    <!-- Metrics Grid -->
    <div class="grid gap-4 md:grid-cols-4">
      <MetricCard
        title="Всего наименований"
        :value="inventory.totalFurniture"
        icon="package"
        trend="+2 новых"
      />
      <MetricCard
        title="Товара на складе"
        :value="`${inventory.furniture.reduce((sum, f) => sum + f.quantity, 0)} шт.`"
        icon="box"
        trend="На месяц"
      />
      <MetricCard
        title="Локаций хранения"
        :value="inventory.totalLocations"
        icon="map"
        trend="активных"
      />
      <MetricCard
        title="Загруженность"
        :value="`${inventory.utilizationRate}%`"
        icon="percent"
        :trend="`${100 - inventory.utilizationRate}% свободно`"
      />
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <!-- Recent Activities -->
      <div class="rounded-lg border border-border bg-card p-6">
        <h3 class="mb-4 text-lg font-semibold">Последние операции</h3>
        <div class="space-y-3">
          <div v-for="shipment in inventory.shipments.slice(0, 3)" :key="shipment.id" class="flex items-center justify-between rounded-lg bg-secondary p-3">
            <div class="flex items-center gap-3">
              <Truck class="h-5 w-5 text-accent" />
              <div>
                <p class="font-medium">{{ shipment.destination }}</p>
                <p class="text-sm text-muted-foreground">Отгрузка: {{ shipment.quantity }} шт.</p>
              </div>
            </div>
            <span class="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">{{ shipment.status }}</span>
          </div>
        </div>
      </div>

      <!-- Low Stock Alert -->
      <div class="rounded-lg border border-border bg-card p-6">
        <h3 class="mb-4 text-lg font-semibold">Товары с низким уровнем запаса</h3>
        <div class="space-y-3">
          <div v-if="inventory.lowStockItems.length === 0" class="text-center py-6 text-muted-foreground">
            Все товары в нормальном количестве
          </div>
          <div v-for="item in inventory.lowStockItems" :key="item.id" class="flex items-center justify-between rounded-lg bg-red-100 p-3 border border-red-200">
            <div>
              <p class="font-medium">{{ item.name }}</p>
              <p class="text-sm text-muted-foreground">Осталось: {{ item.quantity }} шт.</p>
            </div>
            <AlertTriangle class="h-5 w-5 text-red-800" />
          </div>
        </div>
      </div>
    </div>

    <!-- Location Utilization -->
    <div class="rounded-lg border border-border bg-card p-6">
      <h3 class="mb-4 text-lg font-semibold">Использование локаций хранения</h3>
      <div class="space-y-3">
        <div v-for="location in inventory.locations.slice(0, 5)" :key="location.id">
          <div class="mb-1 flex items-center justify-between text-sm">
            <span>{{ location.name }}</span>
            <span class="text-muted-foreground">{{ location.currentLoad }}/{{ location.capacity }}</span>
          </div>
          <div class="h-2 w-full rounded-full bg-secondary">
            <div class="h-full rounded-full bg-accent transition-all" :style="{ width: `${(location.currentLoad / location.capacity) * 100}%` }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInventoryStore } from '../stores/inventory'
import MetricCard from '../components/MetricCard.vue'
import { Truck, Plus, AlertTriangle } from 'lucide-vue-next'

const inventory = useInventoryStore()
</script>
