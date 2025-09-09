<script setup>
import { ref } from 'vue'

import { useCategoriesStore } from '@/stores/categories'

const categoriesStore = useCategoriesStore()
const { getCategories } = categoriesStore

const params = ref({})

async function saveCategory(e) {
  e.preventDefault()
  try {
    const res = await fetch('http://localhost:5002/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params.value)
    })
    const category_id = await res.json()
    if (category_id) {
      getCategories()
    }
    console.log('res', await res.json())
    
  } catch (error) {
    console.log('error', error)
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