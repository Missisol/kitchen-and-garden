<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { useCategoriesStore } from '@/stores/categories'
import { useRecipesStore } from '@/stores/recipes'
import type { Recipe } from '@/@types/recipe'
import RecipeLayout from '@/components/recipes/RecipeLayout.vue'
import RecipeForm from '@/components/recipes/RecipeForm.vue'

interface FileModel {
  file?: File | null
}

const router = useRouter()
const categoriesStore = useCategoriesStore()
const { categories } = storeToRefs(categoriesStore)
const { getCategories } = categoriesStore
const recipesStore = useRecipesStore()
const { createRecipe, uploadFile } = recipesStore

const data = ref<Partial<Recipe>>({
  title: '',
  title_search: '',
  ingredients: '',
  instructions: '',
  links: '',
  comment: '',
  // file: null,
})
const fileModel = ref<FileModel>({ file: null })

if (!categories.value.length) {
  getCategories()
}

async function getFormBody(): Promise<Partial<Recipe> | undefined> {
  if (!data.value.title) {
    return {}
  }

  data.value.title_search = data.value.title.toLowerCase()

  if (data.value.ingredients) {
    data.value.ingredients = data.value.ingredients.toLowerCase()
  }

  if (fileModel.value.file) {
    const formData = new FormData()
    formData.append('file', fileModel.value.file)
    const result = await uploadFile(formData)
    if (result?.filename) {
      data.value.file = result.filename
    }
  }
}

async function create() {
  await getFormBody()
  
  try {
    const result = await createRecipe(data.value)
    if (result?.id) {
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