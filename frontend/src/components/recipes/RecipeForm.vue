<script setup>
import CommonButton from '../common/CommonButton.vue'
import IconSave from '../icons/IconSave.vue'
import IconDelete from '../icons/IconDelete.vue'

const { categories, mode } = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  mode: {
    type: String,
    default: 'create',
  }
})

const emit = defineEmits(['getFormBody'])

const model = defineModel('model')
const fileModel = defineModel('fileModel')

function handleFileChange(event) {
  fileModel.value.file = event.target.files[0]
}

function deleteFile() {
  model.value.file = null
}

function sendForm() {
  emit('getFormBody')
}
</script>

<template>
  <form class="form">
    <label
      v-if="mode === 'create'"
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
      <select
        v-model="model.category_id"
        id="category"
      >
        <option 
          v-for="category in categories" 
          :key="category.id" 
          :value="category.id"
        >{{ category?.name || 'Без категории' }}</option>
      </select>
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
      <div
        v-if="model.file"
        class="del-file-wrapper"
      >
        <div>{{ model.file }}</div>
        <CommonButton @buttonAction="deleteFile">
          <template #icon><IconDelete /></template>
          <template #text>Удалить файл</template>
        </CommonButton>
      </div>
      <div
        v-else
        class="add-file-wrapper"
      >
        <div v-if="fileModel?.file?.name">{{ fileModel.file.name }}</div>
        <label
          v-else
          for="file"
          class="file-label"
        >Добавьте файл</label>
        <input
          type="file" 
          name="file" 
          id="file"
          class="file-input"
          accept=".doc, .docx, .pdf, .png, .jpg, .jpeg"
          @change="handleFileChange"
        >
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
    <CommonButton @buttonAction="sendForm">
      <template #icon><IconSave /></template>
      <template #text>Сохранить изменения</template>
    </CommonButton>
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
  background: hsl(from var(--color-background) h s l / 0.5);
  border: 1px solid var(--color-input);
  border-radius: calc(var(--radius) - 2px);
  padding: 0.5rem 0.75rem;
}

.file-wrapper,
.del-file-wrapper {
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
  transition: all 0.2s ease-in-out;

    &:hover {
    background: hsl(from var(--color-primary) h s l / 0.9);
    color: var(--color-primary-foreground);
  }
}

.file-wrapper .common-button {
  --cbtn-background: var(--color-destructive);
  --cbtn-border: var(--color-input);
  --text-color: var(--color-foreground);
  --cbtn-hover: hsl(from var(--color-destructive) h s l / 0.9);
  --text-hover: var(--color-foreground);

  align-self: flex-start;
}

.add-file-wrapper {
  display: flex;
}

.file-input {
  opacity: 0;
}
</style>