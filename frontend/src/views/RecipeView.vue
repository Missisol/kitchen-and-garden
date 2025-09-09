<script setup>
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useRecipesStore } from '@/stores/recipes'

const router = useRouter()
const route = useRoute()

const recipesStore =  useRecipesStore()
const { recipe } = storeToRefs(recipesStore)
const { getRecipeById, deleteRecipeById } = recipesStore

getRecipeById(route.params.id)

async function deleteRecipe(id) {
  await deleteRecipeById(id)
  router.push({ path: '/' })
}
</script>

<template>
  <h1>{{ recipe.title }}</h1>
  <p>Ингредиенты: {{ recipe.ingredients }}</p>
  <p>Инструкции: {{ recipe.instructions }}</p>
  <p v-if="recipe.links">Ссылки: {{ recipe.links }}</p>
  <p v-if="recipe.comment">Комментарий: {{ recipe.comment }}</p>
  <div class="wrapper">
    <button type="button">
      <RouterLink :to="`/recipes/${recipe.id}/edit`">Редактировать</RouterLink>
    </button>
    <button type="button">Добавить комментарий</button>
    <button type="button" @click="deleteRecipe(recipe.id)">Удалить</button>
  </div>
</template>

<style scoped></style>