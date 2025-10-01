<script setup>
import { ref } from 'vue'

import { useCategoriesStore } from '@/stores/categories'
import CommonButton from '../common/CommonButton.vue'

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
  <section>
    <h4>Добавление категории</h4>
    <form @submit="saveCategory($event)">
      <label for="category_add"></label>
      <input
        v-model="params.name"
        id="category_add"
        type="text"
      >
      <CommonButton :buttonType="'submit'">Добавить</CommonButton>
    </form>
  </section>
</template>

<style scoped></style>