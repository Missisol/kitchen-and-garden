<script setup lang="ts">
import { ref } from 'vue'

import { useCategoriesStore } from '@/stores/categories'
import CategoryAction from './CategoryAction.vue'
import IconPlus from '../icons/IconPlus.vue'
import type { Category } from '@/types/category'

const categoriesStore = useCategoriesStore()
const { getCategories, createCategory } = categoriesStore

const params = ref<Category>({
  name: '',
  id: ''
})

async function saveCategory(e: SubmitEvent) {
  e.preventDefault()

  if (!params.value.name) {
    return
  }
  const res = await createCategory(params.value)
  if (res?.id) {
    params.value = {
      name: '',
      id: ''
    }
    getCategories()
  }
}
</script>

<template>
  <CategoryAction
    title="Добавить категорию"
    idName="category_add"
    @submitAction="saveCategory"
  >
    <template #input>
      <input
        v-model="params.name"
        id="category_add"
        type="text"
        placeholder="Название категории"
        class="input"
      >
    </template>
    <template #icon>
      <IconPlus />
    </template>
  </CategoryAction>
</template>

<style scoped>
</style>