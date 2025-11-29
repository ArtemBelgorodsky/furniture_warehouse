<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-3xl font-bold">Инвентарь</h2>
      <button @click="showAddModal = true" class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90">
        <Plus class="h-4 w-4" />
        Добавить мебель
      </button>
    </div>

    <!-- Search & Filter -->
    <div class="flex gap-3">
      <div class="flex-1 rounded-lg border border-border bg-input px-4 py-2 flex items-center">
        <Search class="h-4 w-4 text-muted-foreground mr-2" />
        <input v-model="searchQuery" type="text" placeholder="Поиск мебели..." class="w-full bg-transparent outline-none" />
      </div>
      <select v-model="filterStatus" class="rounded-lg border border-border bg-input px-4 py-2 outline-none">
        <option value="">Все статусы</option>
        <option value="в_наличии">В наличии</option>
        <option value="зарезервировано">Зарезервировано</option>
        <option value="на_пути">На пути</option>
      </select>
    </div>

    <!-- Furniture List -->
    <div class="grid gap-4">
      <div v-for="item in filteredFurniture" :key="item.id" class="rounded-lg border border-border bg-card p-4 hover:border-primary transition-colors">
        <div class="flex gap-4">
          <div class="h-24 w-24 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
            <Package class="h-8 w-8 text-muted-foreground" />
          </div>
          <div class="flex-1">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-lg font-semibold">{{ item.name }}</h3>
                <p class="text-sm text-muted-foreground">SKU: {{ item.sku }}</p>
                <p class="text-sm text-muted-foreground mt-1">{{ item.description }}</p>
              </div>
              <span :class="['rounded-full px-3 py-1 text-xs font-medium', getStatusColor(item.status)]">
                {{ getStatusLabel(item.status) }}
              </span>
            </div>
            <div class="mt-3 grid grid-cols-3 gap-3 text-sm">
              <div>
                <p class="text-muted-foreground">Количество</p>
                <p class="font-semibold">{{ item.quantity }} шт.</p>
              </div>
              <div>
                <p class="text-muted-foreground">Локация</p>
                <p class="font-semibold">{{ item.location }}</p>
              </div>
              <div>
                <p class="text-muted-foreground">Деталей в наборе</p>
                <p class="font-semibold">{{ item.parts.length }}</p>
              </div>
            </div>
            <div class="mt-3 flex items-center gap-2">
              <button @click="selectedFurniture = item; showDetailsModal = true" class="flex items-center gap-1 text-xs rounded-lg bg-secondary px-3 py-1.5 hover:bg-secondary/80 transition-colors">
                <Eye class="h-3 w-3" />
                Детали
              </button>
              <button @click="editFurniture(item)" class="flex items-center gap-1 text-xs rounded-lg bg-secondary px-3 py-1.5 hover:bg-secondary/80 transition-colors">
                <Edit class="h-3 w-3" />
                Редактировать
              </button>
              <button @click="inventory.deleteFurniture(item.id)" class="flex items-center gap-1 text-xs rounded-lg bg-red-900/50 px-3 py-1.5 hover:bg-red-900/70 transition-colors text-red-200">
                <Trash2 class="h-3 w-3" />
                Удалить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <Modal v-if="showDetailsModal" @close="showDetailsModal = false" title="Детали мебели">
      <div v-if="selectedFurniture" class="space-y-4">
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold">Компоненты набора:</h3>
            <button @click="showPartModal = true; editingPartId = null; resetPartForm()" class="flex items-center gap-1 text-xs rounded-lg bg-primary px-3 py-1.5 text-white hover:bg-primary/90">
              <Plus class="h-3 w-3" />
              Добавить
            </button>
          </div>
          <div class="space-y-2">
            <div v-for="part in selectedFurniture.parts" :key="part.id" class="p-3 bg-secondary rounded-lg">
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-medium">{{ part.name }}</p>
                  <p class="text-xs text-muted-foreground">SKU: {{ part.sku }}</p>
                  <p class="text-xs text-muted-foreground mt-1">Тип: {{ part.type === 'фурнитура' ? '🔧 Фурнитура' : '📦 Часть' }}</p>
                </div>
                <div class="text-right flex items-center gap-2">
                  <p class="font-semibold">{{ part.quantity }} шт.</p>
                  <p class="text-xs text-muted-foreground">{{ part.location }}</p>
                  <div class="flex gap-1">
                    <button @click="editPart(part)" class="text-xs rounded bg-secondary px-2 py-1 hover:bg-secondary/80">
                      <Edit class="h-3 w-3" />
                    </button>
                    <button @click="deletePart(part.id)" class="text-xs rounded bg-red-100 px-2 py-1 hover:bg-red-200 text-red-800">
                      <Trash2 class="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>

    <!-- Add/Edit Part Modal -->
    <Modal v-if="showPartModal" @close="showPartModal = false" :title="editingPartId ? 'Редактировать компонент' : 'Добавить компонент'">
      <form @submit.prevent="savePart" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Название</label>
          <input v-model="partForm.name" type="text" class="w-full rounded-lg border border-border bg-input px-3 py-2 outline-none focus:border-primary" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">SKU</label>
          <input v-model="partForm.sku" type="text" class="w-full rounded-lg border border-border bg-input px-3 py-2 outline-none focus:border-primary" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Количество</label>
          <input v-model.number="partForm.quantity" type="number" class="w-full rounded-lg border border-border bg-input px-3 py-2 outline-none focus:border-primary" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Локация</label>
          <select v-model="partForm.location" class="w-full rounded-lg border border-border bg-input px-3 py-2 outline-none focus:border-primary">
            <option v-for="loc in inventory.locations" :key="loc.id" :value="loc.name">{{ loc.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Тип</label>
          <select v-model="partForm.type" class="w-full rounded-lg border border-border bg-input px-3 py-2 outline-none focus:border-primary" required>
            <option value="часть">📦 Часть</option>
            <option value="фурнитура">🔧 Фурнитура</option>
          </select>
        </div>
        <div class="flex gap-2 pt-4">
          <button type="submit" class="flex-1 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90">Сохранить</button>
          <button type="button" @click="showPartModal = false" class="flex-1 rounded-lg border border-border px-4 py-2 hover:bg-secondary">Отмена</button>
        </div>
      </form>
    </Modal>

    <!-- Add/Edit Modal -->
    <Modal v-if="showAddModal" @close="showAddModal = false" :title="editingId ? 'Редактировать мебель' : 'Добавить новую мебель'">
      <form @submit.prevent="saveFurniture" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Название</label>
          <input v-model="formData.name" type="text" class="w-full rounded-lg border border-border bg-input px-3 py-2 outline-none focus:border-primary" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">SKU</label>
          <input v-model="formData.sku" type="text" class="w-full rounded-lg border border-border bg-input px-3 py-2 outline-none focus:border-primary" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Описание</label>
          <textarea v-model="formData.description" class="w-full rounded-lg border border-border bg-input px-3 py-2 outline-none focus:border-primary" rows="3"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Количество</label>
          <input v-model.number="formData.quantity" type="number" class="w-full rounded-lg border border-border bg-input px-3 py-2 outline-none focus:border-primary" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Локация</label>
          <select v-model="formData.location" class="w-full rounded-lg border border-border bg-input px-3 py-2 outline-none focus:border-primary">
            <option v-for="loc in inventory.locations" :key="loc.id" :value="loc.name">{{ loc.name }}</option>
          </select>
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
import { useInventoryStore, type Furniture, type FurniturePart } from '../stores/inventory'
import Modal from '../components/Modal.vue'
import { Plus, Package, Eye, Edit, Trash2, Search } from 'lucide-vue-next'

const inventory = useInventoryStore()
const searchQuery = ref('')
const filterStatus = ref('')
const showAddModal = ref(false)
const showDetailsModal = ref(false)
const selectedFurniture = ref<Furniture | null>(null)
const editingId = ref<string | null>(null)
const showPartModal = ref(false)
const editingPartId = ref<string | null>(null)

const formData = ref({
  name: '',
  sku: '',
  description: '',
  quantity: 0,
  location: ''
})

const partForm = ref({
  name: '',
  sku: '',
  quantity: 0,
  location: '',
  type: 'часть' as 'часть' | 'фурнитура'
})

const filteredFurniture = computed(() => {
  return inventory.furniture.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !filterStatus.value || item.status === filterStatus.value
    return matchesSearch && matchesStatus
  })
})

const editFurniture = (item: Furniture) => {
  editingId.value = item.id
  formData.value = {
    name: item.name,
    sku: item.sku,
    description: item.description,
    quantity: item.quantity,
    location: item.location
  }
  showAddModal.value = true
}

const saveFurniture = () => {
  if (editingId.value) {
    inventory.updateFurniture(editingId.value, {
      ...formData.value
    })
    editingId.value = null
  } else {
    const newId = Date.now().toString()
    const item = inventory.furniture[0]
    inventory.addFurniture({
      id: newId,
      ...formData.value,
      status: 'в_наличии',
      parts: []
    })
  }
  resetForm()
  showAddModal.value = false
}

const resetForm = () => {
  formData.value = { name: '', sku: '', description: '', quantity: 0, location: '' }
}

const resetPartForm = () => {
  partForm.value = { name: '', sku: '', quantity: 0, location: '', type: 'часть' }
}

const editPart = (part: FurniturePart) => {
  editingPartId.value = part.id
  partForm.value = { ...part }
  showPartModal.value = true
}

const deletePart = (partId: string) => {
  if (selectedFurniture.value) {
    const updatedParts = selectedFurniture.value.parts.filter(p => p.id !== partId)
    inventory.updateFurniture(selectedFurniture.value.id, { parts: updatedParts })
    // Update selectedFurniture to reflect changes
    selectedFurniture.value = inventory.getFurnitureById(selectedFurniture.value.id)!
  }
}

const savePart = () => {
  if (!selectedFurniture.value) return

  if (editingPartId.value) {
    // Update existing part
    const updatedParts = selectedFurniture.value.parts.map(p =>
      p.id === editingPartId.value ? { ...partForm.value, id: editingPartId.value } : p
    )
    inventory.updateFurniture(selectedFurniture.value.id, { parts: updatedParts })
  } else {
    // Add new part
    const newPart: FurniturePart = {
      id: Date.now().toString(),
      ...partForm.value
    }
    const updatedParts = [...selectedFurniture.value.parts, newPart]
    inventory.updateFurniture(selectedFurniture.value.id, { parts: updatedParts })
  }

  // Update selectedFurniture to reflect changes
  selectedFurniture.value = inventory.getFurnitureById(selectedFurniture.value.id)!

  showPartModal.value = false
  editingPartId.value = null
  resetPartForm()
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
  return colors[status] || 'bg-secondary text-muted-foreground'
}
</script>
