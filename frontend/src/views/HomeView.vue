<script setup>
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { debounce } from 'perfect-debounce'

import { useCategoriesStore } from '@/stores/categories'
import { useRecipesStore } from '@/stores/recipes'
import RecipesList from '@/components/RecipesList.vue'
import CategoryCreate from '@/components/category/CategoryCreate.vue'
import CategoryDelete from '@/components/category/CategoryDelete.vue'

const categoriesStore = useCategoriesStore()
const { categories } = storeToRefs(categoriesStore)
const { getCategories } = categoriesStore

const recipesStore = useRecipesStore()
const { category_params, searchQuery } = storeToRefs(recipesStore)
const { getRecipes } = recipesStore

const debounced = debounce(async() => getRecipes(), 500)

const getParams = async(category) => {
  category_params.value = category?.id ? {id: category.id, name: category.name} : { id: '', name: '' }
}

getCategories()
getRecipes() // Первоначальная загрузка рецептов

watch(searchQuery, () => {
  debounced()
})

watch(() => category_params.value, async (n, o) => {
  console.log('store', `params:${category_params.value.id}` , `n:${n.id}`, `o:${o.id}`)
  if (n.id !== o.id) {
    getRecipes() // Обновляем рецепты при изменении категории
  }
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
          v-model="searchQuery"
          placeholder="Поиск по названию или ингредиентам"
          class="search-input"
        >
      </div>
      <RecipesList />
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
</style>