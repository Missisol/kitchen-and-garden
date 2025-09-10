<script setup>
const { categories } = defineProps({
  categories: Array
})

const emit = defineEmits(['getFormBody'])

const model = defineModel('model')
const fileModel = defineModel('fileModel')

function handleFileChange(event) {
  fileModel.value.file = event.target.files[0]
}
</script>

<template>
  <form class="form" @submit="emit('getFormBody', $event)">
    <label for="title">title</label>
    <input v-model="model.title" id="title" type="text">
    <label for="ingredients">ingredients</label>
    <input v-model="model.ingredients" id="ingredients" type="text">
    <label for="instructions">instructions</label>
    <input v-model="model.instructions" id="instructions" type="text">
    <label for="links">links</label>
    <input v-model="model.links" id="links" type="text">
    <label for="category">category</label>
    <select v-model="model.category_id" id="category">
      <option 
        v-for="category in categories" 
        :key="category.id" 
        :value="category.id">{{ category?.name || 'Без категории' }}</option>
    </select>
    <label for="file">Добавьте файл</label>
    <input
      type="file" 
      name="file" 
      id="file" 
      accept=".doc, .docx, .pdf, .png, .jpg, .jpeg"
      @change="handleFileChange"
    >
    <label for="comment">comment</label>
    <textarea v-model="model.comment" name="comment" id="comment"></textarea>

    <button type="submit">Добавить</button>
  </form>
</template>

<style scoped>
.form {
  display: grid;
  gap: 1rem;
  width: 400px;
}
</style>