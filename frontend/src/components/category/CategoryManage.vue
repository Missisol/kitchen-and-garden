<script setup>
import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useCategoriesStore } from '@/stores/categories'
import CategorySelect from './CategorySelect.vue'
import IconEdit from '../icons/IconEdit.vue'
import IconDelete from '../icons/IconDelete.vue'
import CommonConfirmDialog from '../common/CommonConfirmDialog.vue'
import CommonButton from '../common/CommonButton.vue'

const categoriesStore = useCategoriesStore()
const { categories } = storeToRefs(categoriesStore)
const { getCategories, updateCategoryById, deleteCategoryById } = categoriesStore

const emit = defineEmits(['getRecipes'])

const categoryId = ref('')
const categoryName = ref('')
const showDeleteDialog = ref(false)

// Computed property to get the selected category name for the warning message
const selectedCategoryName = computed(() => {
  if (categoryId.value) {
    const selectedCategory = categories.value.find(cat => cat.id === categoryId.value)
    return selectedCategory?.name || ''
  }
  return ''
})

// Computed property for the delete confirmation message
const deleteMessage = computed(() => {
  return `Вы уверены, что хотите удалить категорию "${selectedCategoryName.value}"? Это действие также удалит все рецепты, связанные с этой категорией. Это действие нельзя отменить.`
})

// Watch for category selection to populate the name field
watch(categoryId, (newId) => {
  if (newId) {
    const selectedCategory = categories.value.find(cat => cat.id === newId)
    categoryName.value = selectedCategory?.name || ''
  } else {
    categoryName.value = ''
  }
})

async function updateCategory() {
  if (!categoryId.value || !categoryName.value) {
    return
  }
  if (selectedCategoryName.value === categoryName.value) {
    return
  }

  const res = await updateCategoryById(categoryId.value, categoryName.value)
  if (res?.id) {
    categoryId.value = ''
    categoryName.value = ''
    getCategories()
  }
}

function handleDeleteClick() {
  if (!categoryId.value) {
    return
  }
  showDeleteDialog.value = true
}

async function confirmDelete() {
  if (!categoryId.value) {
    return
  }
  const res = await deleteCategoryById(categoryId.value)
  if (res === 204) {
    categoryId.value = ''
    categoryName.value = ''
    getCategories()
    emit('getRecipes')
  }
}

function clearInput() {
  categoryId.value = ''
  categoryName.value = ''
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
        <div class="input__container">
          <input
            v-model="categoryName"
            id="category_manage_name"
            type="text"
            placeholder="Новое название категории"
            class="input"
            :disabled="!categoryId"
          >
          <button
            v-if="categoryName"
            class="input__close"
            @click="clearInput"
          >
            <img
              src="@/assets/icons/close.svg"
              alt="Close"
            >
          </button>
        </div>
      </div>
      <div class="form__buttons">
        <CommonButton
          :disabled="!categoryId"
          className="form__button--delete"
          @buttonAction="handleDeleteClick"
        >
          <template #icon>
            <IconDelete />
          </template>
        </CommonButton>
        <CommonButton
          :disabled="!categoryId || !categoryName || selectedCategoryName === categoryName"
          className="form__button--update"
          @buttonAction="updateCategory"
        >
          <template #icon>
            <IconEdit />
          </template>
        </CommonButton>
      </div>
    </div>
  </form>
  <CommonConfirmDialog
    v-model="showDeleteDialog"
    title="Удаление категории"
    :message="deleteMessage"
    :confirmText="'Удалить'"
    :cancelText="'Отмена'"
    @confirm="confirmDelete"
  />
</template>

<style scoped>
.form {
  --cbtn-background: var(--color-primary);
  --text-color: var(--color-primary-foreground);
  --label-color: var(--color-primary);
  --btn-padding: calc(0.75rem - 1px);
  --btn-padding-block: var(--btn-padding);
  --btn-padding-inline: var(--btn-padding);

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

.form__label--manage {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.form__inputs > .input,
.input__container {
  width: 100%;
}

.input__container {
  display: grid;
  grid-template-columns:  1fr auto;
  grid-template-rows: auto;
}

.input {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}

.input__close {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: transparent;
  border: none;
}

.input__close img {
  width: 1rem;
  height: 1rem;
}

.form__buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form__button--delete {
  --cbtn-background: var(--color-destructive);
  --cbtn-border: var(--color-destructive);
  --text-color: var(--color-destructive-foreground);
  --text-hover: var(--text-color);
}

.form__button--update {
  --cbtn-background: var(--color-primary);
  --cbtn-border: var(--color-primary);
  --text-color: var(--color-primary-foreground);
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

.form__action .input::placeholder {
  color: hsl(from var(--color-foreground) h s l / 0.6);
}

.form__action .input:focus-visible, 
.form__action .input:focus {
  outline: 2px solid var(--color-ring);
}

.form__action .input:focus:not(:focus-visible) {
  outline: none;
}
</style>

