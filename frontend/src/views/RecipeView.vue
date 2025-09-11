<script setup>
import { computed, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useRecipesStore } from '@/stores/recipes'

const router = useRouter()
const route = useRoute()

const recipesStore =  useRecipesStore()
const { recipe, filePath } = storeToRefs(recipesStore)
const { getRecipeById, deleteRecipeById } = recipesStore

getRecipeById(route.params.id)

const links = computed(() => {
  if (recipe.value.links) {
    console.log('links', recipe.value.links)
    return recipe.value.links.split(',').map(link => link.trim())
    
  }
  return []
})

async function deleteRecipe(id) {
  await deleteRecipeById(id)
  router.push({ path: '/' })
}

onBeforeUnmount(() => {
  filePath.value = ''
})
</script>

<template>
  <section class="recipe">
    <h1>{{ recipe.title }}</h1>
    <p>Ингредиенты: {{ recipe.ingredients }}</p>
    <p>Инструкции: {{ recipe.instructions }}</p>
    <ul v-if="recipe.links">
      <li v-for="link in links"
          :key="link"
      >
        <a :href="link"
           target="_blank"
           class="link"
        >{{ link }}</a>
      </li>
    </ul>
    <p v-if="recipe.comment">Комментарий: {{ recipe.comment }}</p>
    <a v-if="filePath"
       :href="filePath"
       target="_blank"
       class="link"
    >Открыть файл</a>
    <div class="wrapper">
      <button type="button">
        <RouterLink :to="`/recipes/${recipe.id}/edit`">Редактировать</RouterLink>
      </button>
      <button type="button">Добавить комментарий</button>
      <button type="button"
              @click="deleteRecipe(recipe.id)"
      >Удалить</button>
    </div>
  </section>
</template>

<style scoped>
.recipe {
  & .link {
    color: inherit;
  }
}
</style>