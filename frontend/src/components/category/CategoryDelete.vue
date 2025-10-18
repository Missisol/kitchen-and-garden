<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useCategoriesStore } from '@/stores/categories'
import CategoryAction from './CategoryAction.vue'
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
      <select
        v-model="model"
        name="category"
        id="category_del"
        class="input"
      >
        <option
          value=""
          selected="true"
          disabled
        >--Выберите категорию--</option>
        <option 
          v-for="category in categories" 
          :key="category.id" 
          :value="category.id"
          :disabled="category?.name === ''"
        >{{ category?.name || 'Без категории' }}</option>
      </select>
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

select,
::picker(select) {
  appearance: base-select;
}

select::picker-icon {
  color: var(--color-muted-foreground);
  transition: 0.4s rotate;
}

select:open::picker-icon {
  rotate: 180deg;
}

::picker(select) {
  border: none;
}

option:disabled {
  color: var(--color-muted-foreground);
}

option {
  display: flex;
  justify-content: flex-start;
  gap: 1rem;

  border: 2px solid var(--color-input);
  background: var(--color-background);
  padding: .5rem;
  transition: 0.4s;
}

option:first-of-type {
  border-radius: .5rem .5rem 0 0;
}

option:last-of-type {
  border-radius: 0 0 .5rem .5rem;
}

::picker(select) {
  border-radius: .5rem;
}

option:not(option:last-of-type) {
  border-bottom: none;
}

option:nth-of-type(odd) {
  background: var(--color-gradient-card);
}

option:hover:not(:disabled),
option:focus {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  font-weight: 600;
}
</style>