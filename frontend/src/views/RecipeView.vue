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
  <div>id: {{ route.params.id }}</div>
  <pre>{{ recipe }}</pre>
</template>

<style scoped></style>