<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { debounce } from 'perfect-debounce'

import { useCategoriesStore } from '@/stores/categories'
import { useRecipesStore } from '@/stores/recipes'
import RecipesList from '@/components/RecipesList.vue'
import CategoryCreate from '@/components/category/CategoryCreate.vue'
import CategoryDelete from '@/components/category/CategoryDelete.vue'
import IconClose from '@/components/icons/IconClose.vue'

const categoriesStore = useCategoriesStore()
const { categories } = storeToRefs(categoriesStore)
const { getCategories } = categoriesStore

const recipesStore = useRecipesStore()
const { category_params, searchQuery, recipes } = storeToRefs(recipesStore)
const { getRecipes } = recipesStore

const searchQueryTitle = ref('')
const filteredRecipes = ref([])

const debounced = debounce(async() => getRecipes(), 500)
const debouncedTitle = debounce(async() => getRecipesByTitle(), 500)

const getParams = async(category) => {
  category_params.value = category?.id ? {id: category.id, name: category.name} : { id: '', name: '' }
}

const getRecipesByTitle = () => {
  filteredRecipes.value = searchQueryTitle.value ? recipes.value.filter(item => item.title.toLowerCase().includes(searchQueryTitle.value.toLowerCase())) : recipes.value
}

const init = async () => {

getCategories()
await getRecipes()
  filteredRecipes.value = recipes.value
}

watch(recipes, () => {
  filteredRecipes.value = recipes.value
})

init()

watch(searchQuery, () => {
  debounced()
})

watch(searchQueryTitle, () => {
  debouncedTitle()
})

watch(() => category_params.value, async (n, o) => {
  // console.log('store', `params:${category_params.value.id}` , `n:${n.id}`, `o:${o.id}`)
  if (n.id !== o.id) {
    getRecipes()
  }
})

onBeforeUnmount(() => {
  searchQuery.value = ''
  searchQueryTitle.value = ''
})
</script>

<template>
  <div class="parent">
    <aside class="aside">
      <h2>Categories</h2>
      <div
        @click=getParams()
        class="category"
      >Все</div>
      <div
        v-for="category in categories"
        :key="category.id"
        class="category"
        @click=getParams(category)
      >
        {{ category?.name ||'Без категории' }}
      </div>
      <CategoryCreate />
      <CategoryDelete />
    </aside>
    <div class="content">
      <div class="search-container">
        <input
          type="text"
          v-model="searchQueryTitle"
          placeholder="Поиск по названию"
          class="search-input"
          @focusin="searchQuery = ''"
        >
        <div
          class="search-close"
          @click="searchQueryTitle = ''" 
        ><IconClose /></div>
      </div>
      <div class="search-container">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Поиск по ингредиентам"
          class="search-input"
          @focusin="searchQueryTitle = ''"
        >
        <div
          class="search-close"
          @click="searchQuery = ''" 
        ><IconClose /></div>
      </div>
      <RecipesList :filteredRecipes="filteredRecipes" />
    </div>
  </div>
</template>

<style scoped>
.parent {
  display: grid;
  grid-template-columns: 1fr 3fr;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-container {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.category {
  cursor: pointer;
  padding: 0.5rem 0;
}

.category:hover {
  background-color: #f0f0f0;
}

.search-container {
  display: grid;
  grid-template-columns: 1fr 40px;
}

.search-input {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}

.search-close {
  cursor: pointer;
  grid-column: 2 / 3;
  grid-row: 1 / 2;
  display: flex;
  align-Items: center; 
  justify-content: center;
}

.search-close > svg {
  width: 24px;
  height: 24px;
}
</style>