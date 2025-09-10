<script setup>
import { storeToRefs } from 'pinia'

import { useCategoriesStore } from '@/stores/categories'
import { useRecipesStore } from '@/stores/recipes'

import RecipesList from '@/components/RecipesList.vue'
import CategoryCreate from '@/components/category/CategoryCreate.vue'
import CategoryDelete from '@/components/category/CategoryDelete.vue'

const categoriesStore = useCategoriesStore()
const { categories } = storeToRefs(categoriesStore)
const { getCategories } = categoriesStore

const recipesStore = useRecipesStore()
const { category_params } = storeToRefs(recipesStore)

const getParams = async(category) => {
  category_params.value = category?.id ? {id: category.id, name: category.name} : { id: '', name: '' }
}

getCategories()
</script>

<template>
  <div class="parent">
    <aside class="aside">
      <h2>Categories</h2>
      <div 
        @click=getParams() 
        class="category">Все</div>
      <div 
        v-for="category in categories" :key="category.id"
        class="category"
        @click=getParams(category)
        >
          {{ category?.name ||'Без категории' }}
      </div>
      <CategoryCreate />
      <CategoryDelete />
    </aside>
    <RecipesList />
  </div>
</template>

<style scoped>
.parent {
  display: grid;
  grid-template-columns: 1fr 3fr;
}

.category {
  cursor: pointer;
}
</style>