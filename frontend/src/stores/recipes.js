import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRecipesStore = defineStore('recipes', () =>{
  const category_params = ref({
    id: '',
    name: '',
  })
  const recipes = ref([])

  async function getRecipes(id) {
    const params = id ? `?category_id=${id}` : ''
    try {
    const res = await fetch(`http://localhost:5002/recipes${params}`)
    recipes.value = await res.json()
    } catch (error) {
      console.log('error', error)
    }
  }

  return {
    category_params,
    recipes,
    getRecipes,
  }
})