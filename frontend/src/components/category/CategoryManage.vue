<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useCategoriesStore } from '@/stores/categories'
import CategorySelect from './CategorySelect.vue'
import IconEdit from '../icons/IconEdit.vue'
import IconDelete from '../icons/IconDelete.vue'

const categoriesStore = useCategoriesStore()
const { categories } = storeToRefs(categoriesStore)
const { getCategories, updateCategoryById, deleteCategoryById } = categoriesStore

const categoryId = ref('')
const categoryName = ref('')

// Watch for category selection to populate the name field
watch(categoryId, (newId) => {
  if (newId) {
    const selectedCategory = categories.value.find(cat => cat.id === newId)
    categoryName.value = selectedCategory?.name || ''
  } else {
    categoryName.value = ''
  }
})

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

async function deleteCategory(e) {
  e.preventDefault()

  if (!categoryId.value) {
    return
  }
  const res = await deleteCategoryById(categoryId.value)
  if (res === 204) {
    categoryId.value = ''
    categoryName.value = ''
    getCategories()
  }
}
</script>

<template>
  <form
    class="form"
    @submit.prevent
  >
    <label
      for="category_manage_select"
      class="form__label"
    >
      Управление категорией
    </label>
    <div class="form__action">
      <div class="form__inputs">
        <CategorySelect
          :categories="categories"
          idName="category_manage_select"
          className="input"
          :isDefaultOption="true"
          :isDisabledCondition="true"
          v-model:model="categoryId"
        />
        <input
          v-model="categoryName"
          id="category_manage_name"
          type="text"
          placeholder="Новое название категории"
          class="input"
          :disabled="!categoryId"
        >
      </div>
      <div class="form__buttons">
        <button
          type="button"
          class="form__button form__button--delete"
          :disabled="!categoryId"
          @click="deleteCategory"
        >
          <IconDelete />
        </button>
        <button
          type="button"
          class="form__button form__button--update"
          :disabled="!categoryId || !categoryName"
          @click="updateCategory"
        >
          <IconEdit />
        </button>
      </div>
    </div>
  </form>
</template>

<style scoped>
.form {
  --btn-color: var(--color-primary);
  --icon-color: var(--color-primary-foreground);
  --label-color: var(--color-primary);

  color: var(--color-card-foreground);
  background: var(--color-gradient-card);
  border: 1px solid hsl(from var(--color-border) h s l / 0.5);
  border-radius: var(--radius);
  padding: 1rem;
}

.form__label {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  color: var(--label-color, var(--color-primary));
}

.form__action {
  display: flex;
  gap: 1rem;
  margin-block-start: 0.75rem;
}

.form__inputs {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-grow: 1;
}

.form__inputs > .input {
  width: 100%;
}

.form__buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form__button {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  border: none;
  color: var(--icon-color, var(--color-primary-foreground));
  background: var(--btn-color, var(--color-primary));
  border-radius: calc(var(--radius) - 2px);
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s;
}

.form__button:hover:not(:disabled) {
  background: hsl(from var(--btn-color) h s l / 0.9);
}

.form__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form__button--delete {
  --btn-color: var(--color-destructive);
  --icon-color: var(--color-destructive-foreground);
}

.form__button--update {
  --btn-color: var(--color-primary);
  --icon-color: var(--color-primary-foreground);
}
</style>

<style>
.form__action .input {
  flex-grow: 1;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--color-foreground);
  background: hsl(from var(--color-background) h s l / 0.5);
  border: 1px solid var(--color-input);
  border-radius: calc(var(--radius) - 2px);
  padding: 0.5rem .75rem;
}

.form__action .input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form__action>input::placeholder {
  color: hsl(from var(--color-foreground) h s l / 0.6);
}

.form__button>svg {
  width: 1rem;
  height: 1rem;
}

.form__action>.input:focus-visible, 
.form__action>.input:focus {
  outline: 2px solid var(--color-ring);
}

.form__action>.input:focus:not(:focus-visible) {
  outline: none;
}
</style>

