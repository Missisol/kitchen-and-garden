<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { useCategoriesStore } from '@/stores/categories'
import { useRecipesStore } from '@/stores/recipes'

import RecipeForm from '@/components/RecipeForm.vue'

const router = useRouter()
const categoriesStore = useCategoriesStore()
const { categories } = storeToRefs(categoriesStore)
const { getCategories } = categoriesStore
const recipesStore = useRecipesStore()
const { createRecipe, uploadFile } = recipesStore

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
    const result = await uploadFile(formData)
    data.value.file = result.filename  // Сохраняем только имя файла
  }
  console.log('data', data.value)
  create()
}

async function create() {
  const result = await createRecipe(data.value)
    if (result.id) {
    router.push({ path: `/` })

      data.value = {
      title: '',
      ingredients: '',
      instructions: '',
      links: '',
      comment: '',
    }
  }
}
</script>

<template>
  <h1>Добавление рецепта</h1>
  <RecipeForm
    v-model:model="data"
    v-model:fileModel="fileModel"
    :categories="categories"
    @getFormBody="getFormBody"
  />
</template>

<style scoped>
</style>