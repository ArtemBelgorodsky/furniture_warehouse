import { createRouter, createWebHistory } from "vue-router"
import Dashboard from "../views/Dashboard.vue"
import Inventory from "../views/Inventory.vue"
import Shipments from "../views/Shipments.vue"
import Receipts from "../views/Receipts.vue"
import Locations from "../views/Locations.vue"
import Reports from "../views/Reports.vue"

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/inventory",
    name: "Inventory",
    component: Inventory,
  },
  {
    path: "/locations",
    name: "Locations",
    component: Locations,
  },
  {
    path: "/shipments",
    name: "Shipments",
    component: Shipments,
  },
  {
    path: "/receipts",
    name: "Receipts",
    component: Receipts,
  },
  {
    path: "/reports",
    name: "Reports",
    component: Reports,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
