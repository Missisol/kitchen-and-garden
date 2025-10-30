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
  const showFavoritesOnly = ref(false)
  const totalPages = ref(1)
  const totalItems = ref(0)
  const currentPage = ref(1)
  const perPage = ref(9) // default

  async function getRecipes(category_id = '', favorite = null, page = 1) {
    const params = new URLSearchParams()
    if (category_id) {
      params.append('category_id', category_id)
    }
    if (ingredientsSearch.value) {
      params.append('search', ingredientsSearch.value)
    }
    if (favorite !== null) {
      params.append('favorite', favorite.toString())
    }
    if (page) {
      params.append('page', page)
    }
    try {
      const res = await fetch(`${apiUrls.recipes}?${params.toString()}`)
      const result = await res.json()
      if (result.recipes && Array.isArray(result.recipes)) {
        recipes.value = result.recipes
        totalPages.value = result.total_pages || 1
        totalItems.value = result.total_items || result.recipes.length
        currentPage.value = result.page || 1
        perPage.value = result.per_page || 9
      } else {
        recipes.value = result
        totalPages.value = 1
        totalItems.value = Array.isArray(result) ? result.length : 0
        currentPage.value = 1
        perPage.value = 9
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  async function getFavoriteRecipes() {
    await getRecipes('', true)
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
      // console.log('recipe', recipe.value)

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

  async function addToFavorites(id) {
    try {
      const res = await fetch(`${apiUrls.recipe}/${id}/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      const data = await res.json()
      // update current recipe
      if (recipe.value && recipe.value.id === id) {
        recipe.value.favorite = data.favorite
      }
      // update list item if present
      const index = recipes.value.findIndex(r => r.id === id)
      if (index !== -1) {
        recipes.value[index] = { ...recipes.value[index], favorite: data.favorite }
      }
      return data
    } catch (error) {
      console.log('error', error)
    }
  }

  async function removeFromFavorites(id) {
    try {
      const res = await fetch(`${apiUrls.recipe}/${id}/favorite`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      const data = await res.json()
      // update current recipe
      if (recipe.value && recipe.value.id === id) {
        recipe.value.favorite = data.favorite
      }
      // update list item if present
      const index = recipes.value.findIndex(r => r.id === id)
      if (index !== -1) {
        recipes.value[index] = { ...recipes.value[index], favorite: data.favorite }
      }
      return data
    } catch (error) {
      console.log('error', error)
    }
  }

  async function toggleFavorite(item) {
    try {
      if (item.favorite) {
        await removeFromFavorites(item.id)
        if (showFavoritesOnly.value) {
          await getFavoriteRecipes()
        }
      } else {
        await addToFavorites(item.id)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
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
    showFavoritesOnly,
    totalPages,
    totalItems,
    currentPage,
    perPage,
    getRecipes,
    getFavoriteRecipes,
    getRecipeById,
    deleteRecipeById,
    createRecipe,
    updateRecipe,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    uploadFile,
    clearCategoryParams,
  }
})