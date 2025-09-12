<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { useCategoriesStore } from '@/stores/categories'
import { useRecipesStore } from '@/stores/recipes'

import RecipeForm from '@/components/RecipeForm.vue'

const router = useRouter()
const categoriesStore = useCategoriesStore()
const { categories } = storeToRefs(categoriesStore)
const { getCategories } = categoriesStore

const recipesStore =  useRecipesStore()
const { recipe, filePath } = storeToRefs(recipesStore)
const { getRecipeById, updateRecipe, uploadFile } = recipesStore

const id = router.currentRoute.value.params.id
console.log('id', id)

const data = ref({
  title: '',
  ingredients: '',
  instructions: '',
  links: '',
  comment: '',
  category_id: '',
})
const fileModel = ref({})
const body = ref({})

getRecipeById(id)

if (!categories.value.length) {
  getCategories()
}

async function getFormBody(e) {
  e.preventDefault()
  console.log('data', data.value)

    if (fileModel.value.file) {
      const formData = new FormData()
      formData.append('file', fileModel.value.file)
      const result = await uploadFile(formData)
      data.value.file = result.filename
    }

    for ( const [key, value] of Object.entries(data.value)) {
      if (value !== recipe.value[key]) {
        body.value[key] = value
      }
    }
    console.log('body', body.value)
    update(id, body.value)
}

async function update(id, body) {
  const result = await updateRecipe(id, body)
  if (result.id) {
    router.push({ path: `/` })
  }
}

watch(() => recipe.value, () => {
  data.value = {
    title: recipe.value.title,
    ingredients: recipe.value.ingredients,
    instructions: recipe.value.instructions,
    links: recipe.value.links,
    comment: recipe.value.comment,
    category_id: recipe.value.category_id,
    file: recipe.value?.file
  }
})
</script>

<template>
  <h1>Редактировать рецепт</h1>
  <RecipeForm
    v-model:model="data"
    v-model:fileModel="fileModel"
    :categories="categories"
    :filePath="filePath"
    @getFormBody="getFormBody"
  />
</template>

<style scoped></style>