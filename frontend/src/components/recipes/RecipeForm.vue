<script setup>
import CommonButton from '../common/CommonButton.vue'
import IconSave from '../icons/IconSave.vue'

const { categories, filePath } = defineProps({
  categories: Array,
  filePath: String
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
  <form 
    class="form" 
  >
    <label for="category">Категория</label>
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

    <label for="ingredients">Ингредиенты</label>
    <textarea 
      v-model="model.ingredients" 
      id="ingredients" 
      type="text"
    ></textarea>
    <label for="instructions">Приготовление</label>
    <textarea 
      v-model="model.instructions" 
      id="instructions" 
      type="text"
    ></textarea>
    <label for="links">Внешние ресурсы</label>
    <textarea
      v-model="model.links"
      id="links"
      type="text"
    ></textarea>
    <div v-if="filePath">
      <h3>Прикрепленный файл</h3>
      <div>{{ model.file }}</div>
      <button 
        type="button" 
        @click="deleteFile"
      >Удалить файл</button>
    </div>
    <div v-else>
      <label for="file">Добавьте файл</label>
      <input
        type="file" 
        name="file" 
        id="file" 
        accept=".doc, .docx, .pdf, .png, .jpg, .jpeg"
        @change="handleFileChange"
      >
    </div>
    <label for="comment">Комментарий</label>
    <textarea
      v-model="model.comment"
      name="comment"
      id="comment"
    ></textarea>

    <CommonButton @buttonAction="sendForm">
      <template #icon><IconSave /></template>
      <template #text>Сохранить изменения</template>
    </CommonButton>
  </form>
</template>

<style scoped>
.form {
  display: grid;
  gap: 1rem;
  width: 400px;
}
</style>