<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { useCategoriesStore } from '@/stores/categories'

import RecipeForm from '@/components/RecipeForm.vue'

const router = useRouter()
const categoriesStore = useCategoriesStore()
const { categories } = storeToRefs(categoriesStore)
const { getCategories } = categoriesStore

const data = ref({
  title: '',
  ingredients: '',
  instructions: '',
  links: '',
  comment: '',
})
const fileModel = ref({})

if (!categories.value.length) {
  getCategories()
}

async function getFormBody(e) {
  e.preventDefault()
  console.log('data', data.value)

  if (!data.value.title) {
    return
  }
  if (fileModel.value.file) {
  const formData = new FormData()
  formData.append('file', fileModel.value.file)

  const res = await fetch('http://localhost:5002/recipe/file', {
    method: 'POST',
    body: formData,
  })
  const result = await res.json()
  console.log('result', result)
  data.value.file = result.filename  // Сохраняем только имя файла
}

  console.log('data', data.value)
    
  await createRecipe(data.value)
  data.value = {
    title: '',
    ingredients: '',
    instructions: '',
    links: '',
    comment: '',
  }
}

async function createRecipe(body) {
  try {
  const res = await fetch('http://localhost:5002/recipe', {
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
  <RecipeForm
    v-model:model="data"
    v-model:file-model="fileModel"
    :categories="categories"
    @getFormBody="getFormBody"
  />
</template>

<style scoped>
</style>