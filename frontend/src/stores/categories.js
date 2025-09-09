import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCategoriesStore = defineStore('categories', () => {
const categories = ref([])

async function getCategories() {
  const res = await fetch(`http://localhost:5002/categories`)
  categories.value = await res.json()
}

async function createCategory(category) {
  try {
    const res = await fetch(`http://localhost:5002/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(category)
    })
    return await res.json()
  } catch (error) {
    console.log('error', error)
  }
}

async function deleteCategoryById(id) {
  try {
    const res =await fetch(`http://localhost:5002/categories`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    })
    return res.status
  } catch (error) {
    console.log('error', error)
  }
}

  return {
    categories,
    getCategories,
    createCategory,
    deleteCategoryById,
  }
})