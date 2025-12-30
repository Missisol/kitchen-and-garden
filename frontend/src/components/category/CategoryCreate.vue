<script setup lang="ts">
import { ref } from 'vue'

import { useCategoriesStore } from '@/stores/categories'
import CategoryAction from './CategoryAction.vue'
import IconPlus from '../icons/IconPlus.vue'

const categoriesStore = useCategoriesStore()
const { getCategories, createCategory } = categoriesStore

interface CategoryParams {
  name?: string
}

const params = ref<CategoryParams>({})

async function saveCategory(e: SubmitEvent) {
  e.preventDefault()

  if (!params.value.name) {
    return
  }
  const res = await createCategory(params.value.name)
  if (res?.id) {
    params.value = {}
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