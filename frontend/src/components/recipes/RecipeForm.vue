<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import CategorySelect from '../category/CategorySelect.vue'
import CommonButton from '../common/CommonButton.vue'
import IconSave from '../icons/IconSave.vue'
import IconDelete from '../icons/IconDelete.vue'

const router = useRouter()
const id = router.currentRoute.value.params.id

const { categories } = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['getFormBody'])

const model = defineModel('model')
const fileModel = defineModel('fileModel')

const isDisabled = computed(() => {
  return model.value?.file || fileModel.value?.file?.name
})

function handleFileChange(event) {
  fileModel.value.file = event.target.files[0]
}

function deleteFile() {
  if (model.value.file) {
  model.value.file = null
  }
  if (fileModel.value.file) {
    fileModel.value.file = null
  }
}

function sendForm() {
  emit('getFormBody')
}

function cancelEditing() {
  router.push({ path: `/recipes/${id}` })
}
</script>

<template>
  <form class="form">
    <label
      for="title"
      class="label"
    >Название
      <input
        type="text"
        name="title"
        id="title"
        v-model="model.title"
      >
    </label>
    <label
      for="category"
      class="label"
    >Категория
      <CategorySelect
        :categories="categories"
        idName="category"
        v-model:model="model.category_id"
      />
      <!-- <select
        v-model="model.category_id"
        id="category"
      >
        <option 
          v-for="category in categories" 
          :key="category.id" 
          :value="category.id"
        >{{ category?.name || 'Без категории' }}</option>
      </select> -->
    </label>
    <label
      for="ingredients"
      class="label"
    >Ингредиенты
      <textarea 
        v-model="model.ingredients" 
        id="ingredients" 
        type="text"
        rows="4"
        wrap="hard"
      ></textarea>
    </label>
    <label
      for="instructions"
      class="label"
    >Приготовление
      <textarea 
        v-model="model.instructions" 
        id="instructions" 
        type="text"
        rows="6"
      ></textarea>
    </label>
    <label
      for="links"
      class="label"
    >Внешние ресурсы
      <textarea
        v-model="model.links"
        id="links"
        type="text"
      ></textarea>
    </label>
    <div class="file-wrapper">
      <h3 class="label">Прикрепленный файл</h3>
      <div>{{ model.file }}</div>
      <div v-if="fileModel?.file?.name">{{ fileModel.file.name }}</div>
      <div class="button-wrapper">
        <label
          for="file"
          class="file-label"
          :class="{ 'file-label--inactive': isDisabled }"
        >Добавьте файл</label>
        <input
          type="file" 
          name="file" 
          id="file"
          class="file-input"
          accept=".doc, .docx, .pdf, .png, .jpg, .jpeg"
          @change="handleFileChange"
        >
        <CommonButton
          :disabled="!isDisabled"
          @buttonAction="deleteFile"
        >
          <template #icon><IconDelete /></template>
          <template #text>Удалить файл</template>
        </CommonButton>
      </div>
    </div>
    <label
      for="comment"
      class="label"
    >Комментарий
      <textarea
        v-model="model.comment"
        name="comment"
        id="comment"
        rows="6"
      ></textarea>
    </label>
    <div class="button-wrapper">
      <CommonButton @buttonAction="sendForm">
        <template #icon><IconSave /></template>
        <template #text>Сохранить изменения</template>
      </CommonButton>
      <div class="common-button--dark">
        <CommonButton @buttonAction="cancelEditing">
          <template #text>Отмена</template>
        </CommonButton>
      </div>
    </div>
  </form>
</template>

<style scoped>
.form {
  display: grid;
  gap: 1.5rem;
}

.label {
  color: var(--color-primary);
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label input, .label textarea, .label select {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 400;
  color: var(--color-foreground);
  background: hsl(from var(--color-background) h s l / 0.5);
  border: 1px solid var(--color-input);
  border-radius: calc(var(--radius) - 2px);
  padding: 0.5rem 0.75rem;
}

.file-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-label {
  background: var(--color-background);
  color: var(--color-foreground);
  border: 1px solid var(--cbtn-border, var(--color-input));
  border-radius: calc(var(--radius) - 2px);
  padding-block: .5rem;
  padding-inline: 1rem;
  display: flex;
  gap: .5rem;
  justify-content: center;
  align-items: center;
  font-size: .875rem;
  line-height: 1.5rem;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.file-label--inactive {
  cursor: default;
  background: var(--color-muted);
  color: var(--color-muted-foreground);
}

.file-label:not(.file-label--inactive):hover {
  background: hsl(from var(--color-primary) h s l / 0.9);
  color: var(--color-primary-foreground);
}

.file-wrapper .common-button {
  --cbtn-background: var(--color-destructive);
  --cbtn-border: var(--color-input);
  --text-color: var(--color-foreground);
  --cbtn-hover: hsl(from var(--color-destructive) h s l / 0.9);
  --text-hover: var(--color-foreground);

  align-self: flex-start;
}

.button-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.file-input {
  opacity: 0;
  width: 1px;
}
</style>