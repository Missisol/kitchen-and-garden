import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiUrls } from '@/utils/apiUrls'

export const useRecipesStore = defineStore('recipes', () => {
  const category_params = ref({
    id: '',
    name: '',
  })
  const recipes = ref([])
  const recipe = ref({})
  const filePath = ref('')
  const ingredientsSearch = ref('')

  async function getRecipes(category_id = '') {
    const params = new URLSearchParams()
    if (category_id) {
      params.append('category_id', category_id)
    }
    if (ingredientsSearch.value) {
      params.append('search', ingredientsSearch.value)
    }

    try {
      const res = await fetch(`${apiUrls.recipes}?${params.toString()}`)
      recipes.value = await res.json()
    } catch (error) {
      console.log('error', error)
    }
  }

  async function getRecipeById(id) {
    recipe.value = {}
    filePath.value = ''
    try {
      const res = await fetch(`${apiUrls.recipes}/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      recipe.value = await res.json()
      console.log('recipe', recipe.value)

      if (recipe.value.file) {
        try {
          const res = await fetch(`${apiUrls.filePath}/${recipe.value.file}`)
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
      await fetch(`${apiUrls.recipe}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      })
    } catch (error) {
      console.log('error', error)
    }
  }

  async function createRecipe(body) {
    try {
      const res = await fetch(`${apiUrls.recipe}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      return await res.json()
    } catch (error) {
      console.log('error', error)
    }
  }

  async function updateRecipe(id, body) {
    try {
      const res = await fetch(`${apiUrls.recipe}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      return await res.json()
    } catch (error) {
      console.log('error', error)
    }
  }

  async function uploadFile(formData) {
    try {
      const res = await fetch(`${apiUrls.recipeFile}`, {
        method: 'POST',
        body: formData
      })
      return await res.json()
    } catch (error) {
      console.log('error', error)
    }
  }

  function clearCategoryParams() {
    category_params.value = {
      id: '',
      name: '',
    }
  }

  return {
    category_params,
    recipes,
    recipe,
    filePath,
    ingredientsSearch,
    getRecipes,
    getRecipeById,
    deleteRecipeById,
    createRecipe,
    updateRecipe,
    uploadFile,
    clearCategoryParams,
  }
})