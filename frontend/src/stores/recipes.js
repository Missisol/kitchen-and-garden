import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRecipesStore = defineStore('recipes', () =>{
  const category_params = ref({
    id: '',
    name: '',
  })
  const recipes = ref([])
  const recipe = ref({})

  async function getRecipes(id) {
    const params = id ? `?category_id=${id}` : ''
    try {
    const res = await fetch(`http://localhost:5002/recipes${params}`)
    recipes.value = await res.json()
    } catch (error) {
      console.log('error', error)
    }
  }

  async function getRecipeById(id){
    try {
      const res = await fetch(`http://localhost:5002/recipe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      })
      recipe.value = await res.json()
      return recipe.value

    } catch (error) {
      console.log('error', error)
      
    }
  }

    async function deleteRecipeById(id) {
    try {
      await fetch(`http://localhost:5002/recipe/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      })
    } catch (error) {
      console.log('error', error)
    }
  }


  return {
    category_params,
    recipes,
    recipe,
    getRecipes,
    getRecipeById,
    deleteRecipeById,
  }
})