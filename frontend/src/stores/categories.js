import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiUrls } from '@/utils/apiUrls'

export const useCategoriesStore = defineStore('categories', () => {
const categories = ref([])

async function getCategories() {
  const res = await fetch(`${apiUrls.categories}`)
  categories.value = await res.json()
}

async function createCategory(category) {
  try {
    const res = await fetch(`${apiUrls.categories}`, {
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

async function manageCategory(id, data) {
  try {
    const res = await fetch(`${apiUrls.categories}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    
    if (res.status === 204) {
      return res.status
    }
    return await res.json()
  } catch (error) {
    console.log('error', error)
  }
}

async function deleteCategoryById(id) {
  return await manageCategory(id, { action: 'delete' })
}

async function updateCategoryById(id, name) {
  return await manageCategory(id, { name })
}

  return {
    categories,
    getCategories,
    createCategory,
    manageCategory,
    deleteCategoryById,
    updateCategoryById,
  }
})