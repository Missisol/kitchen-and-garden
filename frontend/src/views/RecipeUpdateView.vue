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
const { recipe } = storeToRefs(recipesStore)
const { getRecipeById } = recipesStore

const id = router.currentRoute.value.params.id
console.log('id', id)

const data = ref({
  title: '',
  ingredients: '',
  instructions: '',
  image: '',
  links: '',
  comment: '',
  category_id: '',
})

getRecipeById(id)

if (!categories.value.length) {
  getCategories()
}

async function getFormBody(e) {
  e.preventDefault()
  console.log('data', data.value)

  if (data.value.title) {
    // createRecipe(data.value)
  }
}

watch(() => recipe.value, () => {
  data.value = {
    title: recipe.value.title,
    ingredients: recipe.value.ingredients,
    instructions: recipe.value.instructions,
    image: recipe.value.image,
    links: recipe.value.links,
    comment: recipe.value.comment,
    category_id: recipe.value.category_id,
  }
})
</script>

<template>
  <h1>Редактировать рецепт</h1>
  <RecipeForm
    v-model="data"
    :categories="categories"
    @getFormBody="getFormBody"
  />
</template>

<style scoped></style>