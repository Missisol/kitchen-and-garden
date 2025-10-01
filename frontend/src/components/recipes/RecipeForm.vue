<script setup>
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
</script>

<template>
  <form 
    class="form" 
    @submit="emit('getFormBody', $event)"
  >
    <label for="title">title</label>
    <input 
      v-model="model.title" 
      id="title" 
      type="text"
    >
    <label for="ingredients">ingredients</label>
    <input 
      v-model="model.ingredients" 
      id="ingredients" 
      type="text"
    >
    <label for="instructions">instructions</label>
    <textarea 
      v-model="model.instructions" 
      id="instructions" 
      type="text"
    ></textarea>
    <label for="links">links</label>
    <input
      v-model="model.links"
      id="links"
      type="text"
    >
    <label for="category">category</label>
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
    <div v-if="filePath">
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
    <label for="comment">comment</label>
    <textarea
      v-model="model.comment"
      name="comment"
      id="comment"
    ></textarea>

    <button type="submit">Сохранить</button>
  </form>
</template>

<style scoped>
.form {
  display: grid;
  gap: 1rem;
  width: 400px;
}
</style>