<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-3xl font-bold">Приемка товаров</h2>
      <button @click="showAddModal = true" class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90">
        <Plus class="h-4 w-4" />
        Новая приемка
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 border-b border-border">
      <button v-for="status in ['ожидание', 'получена', 'проверка', 'размещена']" :key="status"
        @click="selectedStatus = status"
        :class="['px-4 py-2 font-medium border-b-2 transition-colors', selectedStatus === status ? 'border-primary text-primary' : 'border-transparent text-muted-foreground']">
        {{ getStatusLabel(status) }}
      </button>
    </div>

    <!-- Receipts List -->
    <div class="grid gap-4">
      <div v-for="receipt in filteredReceipts" :key="receipt.id" class="rounded-lg border border-border bg-card p-4 hover:border-primary transition-colors">
        <div class="flex items-start justify-between mb-3">
          <div>
            <h3 class="text-lg font-semibold">{{ getFurnitureName(receipt.furnitureId) }}</h3>
            <p class="text-sm text-muted-foreground">Поставщик: {{ receipt.supplier }}</p>
          </div>
          <span :class="['rounded-full px-3 py-1 text-xs font-medium', getStatusColor(receipt.status)]">
            {{ getStatusLabel(receipt.status) }}
          </span>
        </div>

        <div class="grid grid-cols-4 gap-4 mb-4 text-sm">
          <div>
            <p class="text-muted-foreground">Количество</p>
            <p class="font-semibold">{{ receipt.quantity }} шт.</p>
          </div>
          <div>
            <p class="text-muted-foreground">Дата заказа</p>
            <p class="font-semibold">{{ new Date(receipt.createdAt).toLocaleDateString('ru-RU') }}</p>
          </div>
          <div v-if="receipt.receivedAt">
            <p class="text-muted-foreground">Получена</p>
            <p class="font-semibold">{{ new Date(receipt.receivedAt).toLocaleDateString('ru-RU') }}</p>
          </div>
          <div>
            <p class="text-muted-foreground">ID документа</p>
            <p class="font-semibold text-xs">#{{ receipt.id }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button @click="editReceipt(receipt)" class="flex items-center gap-1 text-xs rounded-lg bg-secondary px-3 py-1.5 hover:bg-secondary/80 transition-colors">
            <Edit class="h-3 w-3" />
            Редактировать
          </button>
          <select 
            :value="receipt.status"
            @change="(e) => updateReceiptStatus(receipt.id, (e.target as HTMLSelectElement).value)"
            class="text-xs rounded-lg border border-border bg-input px-3 py-1.5 outline-none">
            <option value="ожидание">Ожидание</option>
            <option value="получена">Получена</option>
            <option value="проверка">Проверка</option>
            <option value="размещена">Размещена</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Modal v-if="showAddModal" @close="showAddModal = false" :title="editingId ? 'Редактировать приемку' : 'Новая приемка'">
      <form @submit.prevent="saveReceipt" class="space-y-4">
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
          <label class="block text-sm font-medium mb-1">Поставщик</label>
          <input v-model="formData.supplier" type="text" placeholder="Название поставщика" class="w-full rounded-lg border border-border bg-input px-3 py-2 outline-none focus:border-primary" required />
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
import { useInventoryStore, type ReceiptOrder } from '../stores/inventory'
import Modal from '../components/Modal.vue'
import { Plus, Edit } from 'lucide-vue-next'

const inventory = useInventoryStore()
const selectedStatus = ref('ожидание')
const showAddModal = ref(false)
const editingId = ref<string | null>(null)

const formData = ref({
  furnitureId: '',
  quantity: 0,
  supplier: ''
})

const filteredReceipts = computed(() => {
  return inventory.receipts.filter(r => r.status === selectedStatus.value)
})

const getFurnitureName = (id: string) => {
  return inventory.getFurnitureById(id)?.name || 'Неизвестный товар'
}

const editReceipt = (receipt: ReceiptOrder) => {
  editingId.value = receipt.id
  formData.value = {
    furnitureId: receipt.furnitureId,
    quantity: receipt.quantity,
    supplier: receipt.supplier
  }
  showAddModal.value = true
}

const saveReceipt = () => {
  if (editingId.value) {
    inventory.updateReceipt(editingId.value, {
      ...formData.value,
      receivedAt: new Date().toISOString().split('T')[0]
    })
    editingId.value = null
  } else {
    const newReceipt: ReceiptOrder = {
      id: Date.now().toString(),
      ...formData.value,
      status: 'ожидание',
      createdAt: new Date().toISOString().split('T')[0]!
    }
    inventory.addReceipt(newReceipt)
  }
  formData.value = { furnitureId: '', quantity: 0, supplier: '' }
  showAddModal.value = false
}

const updateReceiptStatus = (id: string, status: string) => {
  const receipt = inventory.receipts.find(r => r.id === id)
  const updates: any = { status }
  if (status === 'получена') {
    updates.receivedAt = new Date().toISOString().split('T')[0]
  }
  if (receipt && status === 'размещена') {
    const furniture = inventory.getFurnitureById(receipt.furnitureId)
    if (furniture) {
      const newQuantity = furniture.quantity + receipt.quantity
      inventory.updateFurniture(furniture.id, { quantity: newQuantity })
    }
  }
  inventory.updateReceipt(id, updates)
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'ожидание': 'Ожидание',
    'получена': 'Получена',
    'проверка': 'Проверка',
    'размещена': 'Размещена'
  }
  return labels[status] || status
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'ожидание': 'bg-red-100 text-red-800',
    'получена': 'bg-red-200 text-red-900',
    'проверка': 'bg-red-300 text-red-900',
    'размещена': 'bg-red-400 text-red-900'
  }
  return colors[status] || 'bg-secondary'
}
</script>
