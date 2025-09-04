import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCategoriesStore = defineStore('categories', () => {
const categories = ref([])

async function getCategories() {
  const res = await fetch(`http://localhost:5002/categories`)
  categories.value = await res.json()
}

  return {
    categories,
    getCategories,
  }
})