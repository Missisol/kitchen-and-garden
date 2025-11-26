<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useCategoriesStore } from '@/stores/categories'
import CategoryAction from './CategoryAction.vue'
import CategorySelect from './CategorySelect.vue'
import IconDelete from '../icons/IconDelete.vue'

const categoriesStore = useCategoriesStore()
const { categories } = storeToRefs(categoriesStore)
const { getCategories, deleteCategoryById } = categoriesStore

const model = ref('')

async function deleteCategory(e) {
  e.preventDefault()

  if (!model.value) {
    return
  }
  const res = await deleteCategoryById(model.value)
  if (res === 204) {
    model.value = ''
    getCategories()
  }
}
</script>

<template>
  <CategoryAction
    title="Удалить категорию"
    idName="category_del"
    buttonTitle="Удалить"
    @submitAction="deleteCategory"
  >
    <template #input>
      <CategorySelect
        :categories="categories"
        idName="category_del"
        className="input"
        :isDefaultOption="true"
        :isDisabledCondition="true"
        v-model:model="model"
      />
    </template>
    <template #icon>
      <IconDelete />
    </template>
  </CategoryAction>
</template>

<style scoped>
.form {
  --btn-color: var(--color-destructive);
  --icon-color: var(--color-destructive-foreground);
  --label-color: var(--color-primary);
}
</style>