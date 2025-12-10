<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { useCategoriesStore } from '@/stores/categories'
import { useRecipesStore } from '@/stores/recipes'

import RecipeLayout from '@/components/recipes/RecipeLayout.vue'
import RecipeForm from '@/components/recipes/RecipeForm.vue'

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

async function getFormBody() {
  if (!data.value.title) {
    return
  }

  data.value.title = data.value.title.toLowerCase()

  if (data.value?.ingredients) {
    data.value.ingredients = data.value.ingredients.toLowerCase()
  }

  if (fileModel.value.file) {
    const formData = new FormData()
    formData.append('file', fileModel.value.file)
    const result = await uploadFile(formData)
    data.value.file = result.filename  // Сохраняем только имя файла
  }
}

async function create() {
  await getFormBody()

  try {
  const result = await createRecipe(data.value)
    if (result.id) {
      router.push({ path: '/recipes' })
    }
  } catch (error) {
    console.log('error', error)
  }
}
</script>

<template>
  <RecipeLayout
    @action="router.push({ path: '/recipes' })"
    text="Назад к рецептам"
  >  
    <template #recipe>
      <RecipeForm
        v-model:model="data"
        v-model:fileModel="fileModel"
        :categories="categories"
        @sendForm="create"
      />
    </template>
  </RecipeLayout>
</template>

<style scoped>
</style>