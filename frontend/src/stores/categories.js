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

async function deleteCategoryById(id) {
  try {
    const res =await fetch(`${apiUrls.categories}`, {
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

async function updateCategoryById(id, name) {
  try {
    const res =await fetch(`${apiUrls.categories}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    })
    return await res.json()
  } catch (error) {
    console.log('error', error)
  }
}

  return {
    categories,
    getCategories,
    createCategory,
    deleteCategoryById,
    updateCategoryById,
  }
})