<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useCategoriesStore } from '@/stores/categories'
import CategoryAction from './CategoryAction.vue'

const categoriesStore = useCategoriesStore()
const { categories } = storeToRefs(categoriesStore)
const { getCategories, deleteCategoryById } = categoriesStore

const model = ref({})

async function deleteCategory(e) {
  e.preventDefault()

  if (!model.value.category_id) {
    return
  }
  const res = await deleteCategoryById(model.value.category_id)
  if (res === 204) {
    getCategories()
  }
}
</script>

<template>
  <CategoryAction
    title="Удаление категории"
    idName="category_del"
    buttonTitle="Удалить"
    @submitAction="deleteCategory"
  >
    <select
      v-model="model.category_id"
      id="category_del"
      class="select"
    >
      <option 
        v-for="category in categories" 
        :key="category.id" 
        :value="category.id"
      >{{ category?.name }}</option>
    </select>
  </CategoryAction>
</template>

<style scoped>
.select {
  height: inherit;
}
</style>