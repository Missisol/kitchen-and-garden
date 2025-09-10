import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRecipesStore = defineStore('recipes', () =>{
  const category_params = ref({
    id: '',
    name: '',
  })
  const recipes = ref([])
  const recipe = ref({})
  const filePath = ref('')

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
      const res = await fetch(`http://localhost:5002/recipes/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      recipe.value = await res.json()
      console.log('recipe', recipe.value)
      

      if (recipe.value.file) {
        try {
          const res = await fetch(`http://localhost:5002/static/uploads/${recipe.value.file}`)
          filePath.value = res.url
        } catch (error) {
          console.log('error', error)
          
        }
      }

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
      })
    } catch (error) {
      console.log('error', error)
    }
  }

  return {
    category_params,
    recipes,
    recipe,
    filePath,
    getRecipes,
    getRecipeById,
    deleteRecipeById,
  }
})