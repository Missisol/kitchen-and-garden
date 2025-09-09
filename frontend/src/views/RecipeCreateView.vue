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
    v-model="data"
    :categories="categories"
    @getFormBody="getFormBody"
  />
</template>

<style scoped>
</style>