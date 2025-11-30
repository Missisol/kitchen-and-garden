<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useCategoriesStore } from '@/stores/categories'
import CategoryAction from './CategoryAction.vue'
import CategorySelect from './CategorySelect.vue'
import IconEdit from '../icons/IconEdit.vue'

const categoriesStore = useCategoriesStore()
const { categories } = storeToRefs(categoriesStore)
const { getCategories, updateCategoryById } = categoriesStore

const categoryId = ref('')
const categoryName = ref('')

async function updateCategory(e) {
  e.preventDefault()

  if (!categoryId.value || !categoryName.value) {
    return
  }
  const res = await updateCategoryById(categoryId.value, categoryName.value)
  if (res?.id) {
    categoryId.value = ''
    categoryName.value = ''
    getCategories()
  }
}
</script>

<template>
  <CategoryAction
    title="Изменить категорию"
    idName="category_update"
    buttonTitle="Изменить"
    @submitAction="updateCategory"
  >
    <template #input>
      <div class="form__inputs">
        <CategorySelect
          :categories="categories"
          idName="category_update_select"
          className="input"
          :isDefaultOption="true"
          :isDisabledCondition="true"
          v-model:model="categoryId"
        />
        <input
          v-model="categoryName"
          id="category_update"
          type="text"
          placeholder="Новое название категории"
          class="input"
        >
      </div>
    </template>
    <template #icon>
      <IconEdit />
    </template>
  </CategoryAction>
</template>

<style scoped>
.form__inputs {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-grow: 1;
}

.form__inputs > .input {
  width: 100%;
}
</style>

