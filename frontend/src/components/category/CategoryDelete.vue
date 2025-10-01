<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useCategoriesStore } from '@/stores/categories'
import CommonButton from '../common/CommonButton.vue'

const categoriesStore = useCategoriesStore()
const { categories } = storeToRefs(categoriesStore)
const { getCategories, deleteCategoryById } = categoriesStore

const model = ref({})

async function deleteCategory(e) {
  e.preventDefault()

  console.log('model', model.value.category_id)
  
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
  <section>
    <h4>Удаление категории</h4>
    <form @submit="deleteCategory($event)">
      <label for="category_del"></label>
      <select
        v-model="model.category_id"
        id="category_del"
      >
        <option 
          v-for="category in categories" 
          :key="category.id" 
          :value="category.id"
        >{{ category?.name }}</option>
      </select>
      <CommonButton :buttonType="'submit'">Удалить</CommonButton>
    </form>
  </section>
</template>

<style scoped></style>