<script setup>
import { ref } from 'vue'

import { useCategoriesStore } from '@/stores/categories'

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
    getCategories()
  }
}
</script>

<template>
  <section>
    <h2>Добавление категории</h2>
    <form @submit="saveCategory($event)">
      <label for="category_name"></label>
      <input v-model="params.name" id="category_name" type="text">
      <button type="submit">Добавить</button>
    </form>
  </section>
</template>

<style scoped></style>