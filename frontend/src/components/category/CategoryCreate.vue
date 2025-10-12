<script setup>
import { ref } from 'vue'

import { useCategoriesStore } from '@/stores/categories'
import CategoryAction from './CategoryAction.vue'

const categoriesStore = useCategoriesStore()
const { getCategories, createCategory } = categoriesStore

const params = ref({})

async function saveCategory(e) {
  e.preventDefault()

  if (!params.value.name) {
    return
  }
  const res = await createCategory(params.value)
  if (res?.id) {
    params.value = {}
    getCategories()
  }
}
</script>

<template>
  <CategoryAction
    title="Добавление категории"
    idName="category_add"
    buttonTitle="Добавить"
    @submitAction="saveCategory"
  >
    <input
      v-model="params.name"
      id="category_add"
      type="text"
    >
  </CategoryAction>
</template>

<style scoped></style>