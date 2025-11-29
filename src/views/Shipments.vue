<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-3xl font-bold">Отгрузка товаров</h2>
      <button @click="showAddModal = true" class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90">
        <Plus class="h-4 w-4" />
        Новая отгрузка
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 border-b border-border">
      <button v-for="status in ['новая', 'обработка', 'отправлена', 'доставлена']" :key="status"
        @click="selectedStatus = status"
        :class="['px-4 py-2 font-medium border-b-2 transition-colors', selectedStatus === status ? 'border-primary text-primary' : 'border-transparent text-muted-foreground']">
        {{ getStatusLabel(status) }}
      </button>
    </div>

    <!-- Shipments List -->
    <div class="grid gap-4">
      <div v-for="shipment in filteredShipments" :key="shipment.id" class="rounded-lg border border-border bg-card p-4 hover:border-primary transition-colors">
        <div class="flex items-start justify-between mb-3">
          <div>
            <h3 class="text-lg font-semibold">{{ getFurnitureName(shipment.furnitureId) }}</h3>
            <p class="text-sm text-muted-foreground">ID заказа: #{{ shipment.id }}</p>
          </div>
          <span :class="['rounded-full px-3 py-1 text-xs font-medium', getStatusColor(shipment.status)]">
            {{ getStatusLabel(shipment.status) }}
          </span>
        </div>

        <div class="grid grid-cols-4 gap-4 mb-4 text-sm">
          <div>
            <p class="text-muted-foreground">Пункт назначения</p>
            <p class="font-semibold">{{ shipment.destination }}</p>
          </div>
          <div>
            <p class="text-muted-foreground">Количество</p>
            <p class="font-semibold">{{ shipment.quantity }} шт.</p>
          </div>
          <div>
            <p class="text-muted-foreground">Дата создания</p>
            <p class="font-semibold">{{ new Date(shipment.createdAt).toLocaleDateString('ru-RU') }}</p>
          </div>
          <div v-if="shipment.deliveryDate">
            <p class="text-muted-foreground">Доставка</p>
            <p class="font-semibold">{{ new Date(shipment.deliveryDate).toLocaleDateString('ru-RU') }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button @click="editShipment(shipment)" class="flex items-center gap-1 text-xs rounded-lg bg-secondary px-3 py-1.5 hover:bg-secondary/80 transition-colors">
            <Edit class="h-3 w-3" />
            Редактировать
          </button>
          <select 
            :value="shipment.status"
            @change="(e) => updateShipmentStatus(shipment.id, (e.target as HTMLSelectElement).value)"
            class="text-xs rounded-lg border border-border bg-input px-3 py-1.5 outline-none">
            <option value="новая">Новая</option>
            <option value="обработка">Обработка</option>
            <option value="отправлена">Отправлена</option>
            <option value="доставлена">Доставлена</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Modal v-if="showAddModal" @close="showAddModal = false" :title="editingId ? 'Редактировать отгрузку' : 'Новая отгрузка'">
      <form @submit.prevent="saveShipment" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Мебель</label>
          <select v-model="formData.furnitureId" class="w-full rounded-lg border border-border bg-input px-3 py-2 outline-none focus:border-primary" required>
            <option value="">Выберите мебель</option>
            <option v-for="item in inventory.furniture" :key="item.id" :value="item.id">{{ item.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Количество</label>
          <input v-model.number="formData.quantity" type="number" class="w-full rounded-lg border border-border bg-input px-3 py-2 outline-none focus:border-primary" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Пункт назначения</label>
          <input v-model="formData.destination" type="text" placeholder="Магазин или адрес" class="w-full rounded-lg border border-border bg-input px-3 py-2 outline-none focus:border-primary" required />
        </div>
        <div class="flex gap-2 pt-4">
          <button type="submit" class="flex-1 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90">Сохранить</button>
          <button type="button" @click="showAddModal = false" class="flex-1 rounded-lg border border-border px-4 py-2 hover:bg-secondary">Отмена</button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useInventoryStore, type ShipmentOrder } from '../stores/inventory'
import Modal from '../components/Modal.vue'
import { Plus, Edit } from 'lucide-vue-next'

const inventory = useInventoryStore()
const selectedStatus = ref('новая')
const showAddModal = ref(false)
const editingId = ref<string | null>(null)

const formData = ref({
  furnitureId: '',
  quantity: 0,
  destination: ''
})

const filteredShipments = computed(() => {
  return inventory.shipments.filter(s => s.status === selectedStatus.value)
})

const getFurnitureName = (id: string) => {
  return inventory.getFurnitureById(id)?.name || 'Неизвестный товар'
}

const editShipment = (shipment: ShipmentOrder) => {
  editingId.value = shipment.id
  formData.value = {
    furnitureId: shipment.furnitureId,
    quantity: shipment.quantity,
    destination: shipment.destination
  }
  showAddModal.value = true
}

const saveShipment = () => {
  if (editingId.value) {
    inventory.updateShipment(editingId.value, { ...formData.value })
    editingId.value = null
  } else {
    const newShipment: ShipmentOrder = {
      id: Date.now().toString(),
      ...formData.value,
      status: 'новая',
      createdAt: new Date().toISOString().split('T')[0]!
    }
    inventory.addShipment(newShipment)
  }
  formData.value = { furnitureId: '', quantity: 0, destination: '' }
  showAddModal.value = false
}

const updateShipmentStatus = (id: string, status: string) => {
  const shipment = inventory.shipments.find(s => s.id === id)
  if (shipment && status === 'отправлена') {
    const furniture = inventory.getFurnitureById(shipment.furnitureId)
    if (furniture) {
      const newQuantity = Math.max(0, furniture.quantity - shipment.quantity)
      inventory.updateFurniture(furniture.id, { quantity: newQuantity })
    }
  }
  inventory.updateShipment(id, { status: status as any })
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'новая': 'Новая',
    'обработка': 'Обработка',
    'отправлена': 'Отправлена',
    'доставлена': 'Доставлена'
  }
  return labels[status] || status
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'новая': 'bg-red-100 text-red-800',
    'обработка': 'bg-red-200 text-red-900',
    'отправлена': 'bg-red-300 text-red-900',
    'доставлена': 'bg-red-400 text-red-900'
  }
  return colors[status] || 'bg-secondary'
}
</script>
