<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useCategoriesStore } from '@/stores/categories'

const router = useRouter()
const categoriesStore = useCategoriesStore()
const { categories } = storeToRefs(categoriesStore)
const { getCategories } = categoriesStore

const data = ref({
  title: '',
  ingredients: '',
  instructions: '',
  image: '',
  links: '',
  comment: '',
  category_id: '',
})

if (!categories.value.length) {
  getCategories()
}

async function getFormBody(e) {
  e.preventDefault()
  console.log('data', data.value)

  if (data.value.title) {
    createRecipe(data.value)
  }
}

async function createRecipe(body) {
  try {
  const res = await fetch('http://localhost:5002/recipes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  const result = await res.json()
  if (result.id) {
    router.push({ path: `/` })
    // router.push({ path: `/recipes/${result.id}` })
  }
  } catch (error) {
    console.log('error', error)
  }
}

</script>

<template>
  <h1>Добавление рецепта</h1>
  <form class="form" @submit="getFormBody">
    <label for="title">title</label>
    <input v-model="data.title" id="title" type="text">
    <label for="ingredients">ingredients</label>
    <input v-model="data.ingredients" id="ingredients" type="text">
    <label for="instructions">instructions</label>
    <input v-model="data.instructions" id="instructions" type="text">
    <label for="image">image</label>
    <input v-model="data.image" id="image" type="text">
    <label for="links">links</label>
    <input v-model="data.links" id="links" type="text">
    <label for="comment">comment</label>
    <textarea v-model="data.comment" name="comment" id="comment"></textarea>
    <label for="category">category</label>
    <select v-model="data.category_id" id="category">
      <option 
        v-for="category in categories" 
        :key="category.id" 
        :value="category.id">{{ category?.name || 'Без категории' }}</option>
    </select>
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