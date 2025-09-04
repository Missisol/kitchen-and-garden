<script setup>
import { onBeforeMount } from 'vue'
import RecipesList from '@/components/RecipesList.vue'
import { useCategoriesStore } from '@/stores/categories'
import { useRecipesStore } from '@/stores/recipes'
import { storeToRefs } from 'pinia'

const categoriesStore = useCategoriesStore()
const { categories } = storeToRefs(categoriesStore)
const { getCategories } = categoriesStore

const recipesStore = useRecipesStore()

const getParams = async(category) => {
  console.log('category', category?.id)
  recipesStore.params = category?.id ? {id: category.id, name: category.name} : { id: '', name: '' }
}

onBeforeMount(async () => {
  await getCategories()
})
</script>

<template>
  <div class="parent">
    <aside class="aside">
      <h2>Categories</h2>
      <div @click=getParams()>Все</div>
      <div 
        v-for="category in categories" :key="category.id"
        @click=getParams(category)
        >
        {{ category.name }}
      </div>
    </aside>
    <RecipesList />
  </div>
</template>

<style scoped>
.parent {
  display: grid;
  grid-template-columns: 1fr 3fr;
}
</style>