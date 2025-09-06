<script setup>
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useRecipesStore } from '@/stores/recipes'

const route = useRoute()

const recipesStore =  useRecipesStore()
const { recipe } = storeToRefs(recipesStore)
const { getRecipeById } = recipesStore

getRecipeById(route.params.id)
</script>

<template>
  <h1>{{ recipe.title }}</h1>
    <img v-if="recipe.image" :src="recipe.image" alt="recipe image">
  <p>Ингредиенты: {{ recipe.ingredients }}</p>
  <p>Инструкции: {{ recipe.instructions }}</p>
  <p v-if="recipe.links">Ссылки: {{ recipe.links }}</p>
  <p v-if="recipe.comment">Комментарий: {{ recipe.comment }}</p>
  <div class="wrapper">
    <button type="button">
      <RouterLink :to="`/recipes/${recipe.id}/edit`">Редактировать</RouterLink>
    </button>
    <button type="button">Добавить комментарий</button>
    <button type="button">Удалить</button>
  </div>
</template>

<style scoped></style>