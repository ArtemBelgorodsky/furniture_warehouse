import { defineStore } from "pinia"
import { ref, computed } from "vue"

export interface FurniturePart {
  id: string
  name: string
  sku: string
  quantity: number
  location: string
  type: "фурнитура" | "часть"
}

export interface Furniture {
  id: string
  name: string
  sku: string
  description: string
  parts: FurniturePart[]
  quantity: number
  location: string
  status: "в_наличии" | "зарезервировано" | "на_пути"
  image?: string
}

export interface ShipmentOrder {
  id: string
  furnitureId: string
  quantity: number
  destination: string
  status: "новая" | "обработка" | "отправлена" | "доставлена"
  createdAt: string
  deliveryDate?: string
}

export interface ReceiptOrder {
  id: string
  furnitureId: string
  quantity: number
  supplier: string
  status: "ожидание" | "получена" | "проверка" | "размещена"
  createdAt: string
  receivedAt?: string
}

export interface StorageLocation {
  id: string
  name: string
  type: "полка" | "стеллаж" | "поддон" | "контейнер"
  capacity: number
  currentLoad: number
  items: string[]
}

export const useInventoryStore = defineStore("inventory", () => {
  const furniture = ref<Furniture[]>([
    {
      id: "1",
      name: 'Диван "Классик"',
      sku: "DIV-001",
      description: "Трёхместный диван со съёмными подушками",
      parts: [
        { id: "p1", name: "Основание", sku: "DIV-001-BASE", quantity: 5, location: "Стеллаж A1", type: "часть" },
        { id: "p2", name: "Спинка", sku: "DIV-001-BACK", quantity: 5, location: "Стеллаж A2", type: "часть" },
        { id: "p3", name: "Подлокотник", sku: "DIV-001-ARM", quantity: 10, location: "Полка B1", type: "часть" },
        { id: "p4", name: "Болт М8", sku: "BOLT-M8", quantity: 100, location: "Контейнер C1", type: "фурнитура" },
        { id: "p5", name: "Шайба", sku: "WASH-STL", quantity: 150, location: "Контейнер C1", type: "фурнитура" },
      ],
      quantity: 5,
      location: "Стеллаж A1",
      status: "в_наличии",
      image: "/-----.jpg",
    },
    {
      id: "2",
      name: 'Стол "Минимал"',
      sku: "TBL-001",
      description: "Обеденный стол на 4 человека",
      parts: [
        { id: "p6", name: "Столешница", sku: "TBL-001-TOP", quantity: 8, location: "Стеллаж B1", type: "часть" },
        { id: "p7", name: "Ножка", sku: "TBL-001-LEG", quantity: 32, location: "Стеллаж B2", type: "часть" },
        { id: "p8", name: "Соединитель", sku: "CONN-WOOD", quantity: 50, location: "Полка C2", type: "фурнитура" },
      ],
      quantity: 8,
      location: "Стеллаж B1",
      status: "в_наличии",
    },
    {
      id: "3",
      name: 'Шкаф "Практик"',
      sku: "CAB-001",
      description: "Навесной шкаф с полками",
      parts: [
        { id: "p9", name: "Боковая панель", sku: "CAB-001-SIDE", quantity: 12, location: "Стеллаж C1", type: "часть" },
        { id: "p10", name: "Полка", sku: "CAB-001-SHELF", quantity: 30, location: "Стеллаж C2", type: "часть" },
        { id: "p11", name: "Дверь", sku: "CAB-001-DOOR", quantity: 6, location: "Стеллаж D1", type: "часть" },
        { id: "p12", name: "Петля", sku: "HINGE-BRS", quantity: 80, location: "Контейнер D2", type: "фурнитура" },
      ],
      quantity: 6,
      location: "Стеллаж C1",
      status: "в_наличии",
    },
  ])

  const locations = ref<StorageLocation[]>([
    { id: "loc1", name: "Полка A1", type: "полка", capacity: 50, currentLoad: 35, items: ["DIV-001"] },
    { id: "loc2", name: "Полка B1", type: "полка", capacity: 50, currentLoad: 28, items: ["TBL-001-ARM"] },
    { id: "loc3", name: "Полка C2", type: "полка", capacity: 40, currentLoad: 25, items: ["CONN-WOOD"] },
    { id: "loc4", name: "Стеллаж A1", type: "стеллаж", capacity: 200, currentLoad: 150, items: ["DIV-001-BASE"] },
    { id: "loc5", name: "Стеллаж A2", type: "стеллаж", capacity: 200, currentLoad: 120, items: ["DIV-001-BACK"] },
    { id: "loc6", name: "Стеллаж B1", type: "стеллаж", capacity: 200, currentLoad: 160, items: ["TBL-001-TOP"] },
    { id: "loc7", name: "Стеллаж B2", type: "стеллаж", capacity: 200, currentLoad: 140, items: ["TBL-001-LEG"] },
    { id: "loc8", name: "Стеллаж C1", type: "стеллаж", capacity: 200, currentLoad: 180, items: ["CAB-001-SIDE"] },
    {
      id: "loc9",
      name: "Контейнер C1",
      type: "контейнер",
      capacity: 100,
      currentLoad: 75,
      items: ["BOLT-M8", "WASH-STL"],
    },
    { id: "loc10", name: "Контейнер D2", type: "контейнер", capacity: 100, currentLoad: 60, items: ["HINGE-BRS"] },
  ])

  const shipments = ref<ShipmentOrder[]>([
    {
      id: "s1",
      furnitureId: "1",
      quantity: 2,
      destination: 'Магазин "Центр"',
      status: "отправлена",
      createdAt: "2024-11-25",
    },
    {
      id: "s2",
      furnitureId: "2",
      quantity: 3,
      destination: 'Магазин "Восток"',
      status: "обработка",
      createdAt: "2024-11-27",
    },
    { id: "s3", furnitureId: "3", quantity: 1, destination: 'Магазин "Юг"', status: "новая", createdAt: "2024-11-29" },
  ])

  const receipts = ref<ReceiptOrder[]>([
    {
      id: "r1",
      furnitureId: "1",
      quantity: 10,
      supplier: "Поставщик А",
      status: "получена",
      createdAt: "2024-11-20",
      receivedAt: "2024-11-24",
    },
    {
      id: "r2",
      furnitureId: "2",
      quantity: 5,
      supplier: "Поставщик Б",
      status: "проверка",
      createdAt: "2024-11-25",
      receivedAt: "2024-11-28",
    },
    { id: "r3", furnitureId: "3", quantity: 3, supplier: "Поставщик В", status: "ожидание", createdAt: "2024-11-29" },
  ])

  const addFurniture = (item: Furniture) => {
    furniture.value.push(item)
  }

  const updateFurniture = (id: string, updates: Partial<Furniture>) => {
    const index = furniture.value.findIndex((f) => f.id === id)
    if (index !== -1) {
      furniture.value[index] = { ...furniture.value[index], ...updates } as Furniture
    }
  }

  const deleteFurniture = (id: string) => {
    furniture.value = furniture.value.filter((f) => f.id !== id)
  }

  const addShipment = (order: ShipmentOrder) => {
    shipments.value.push(order)
  }

  const updateShipment = (id: string, updates: Partial<ShipmentOrder>) => {
    const index = shipments.value.findIndex((s) => s.id === id)
    if (index !== -1) {
      shipments.value[index] = { ...shipments.value[index], ...updates } as ShipmentOrder
    }
  }

  const addReceipt = (order: ReceiptOrder) => {
    receipts.value.push(order)
  }

  const updateReceipt = (id: string, updates: Partial<ReceiptOrder>) => {
    const index = receipts.value.findIndex((r) => r.id === id)
    if (index !== -1) {
      receipts.value[index] = { ...receipts.value[index], ...updates } as ReceiptOrder
    }
  }

  const getFurnitureById = (id: string) => {
    return furniture.value.find((f) => f.id === id)
  }

  const totalFurniture = computed(() => furniture.value.length)
  const lowStockItems = computed(() => furniture.value.filter((f) => f.quantity < 5))
  const totalLocations = computed(() => locations.value.length)
  const utilizationRate = computed(() => {
    const totalCapacity = locations.value.reduce((sum, loc) => sum + loc.capacity, 0)
    const totalLoad = locations.value.reduce((sum, loc) => sum + loc.currentLoad, 0)
    return Math.round((totalLoad / totalCapacity) * 100)
  })

  return {
    furniture,
    locations,
    shipments,
    receipts,
    addFurniture,
    updateFurniture,
    deleteFurniture,
    addShipment,
    updateShipment,
    addReceipt,
    updateReceipt,
    getFurnitureById,
    totalFurniture,
    lowStockItems,
    totalLocations,
    utilizationRate,
  }
})
