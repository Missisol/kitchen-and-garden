<script setup>
import { computed, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useRecipesStore } from '@/stores/recipes'
import CommonError from '@/components/common/CommonError.vue'

const router = useRouter()
const route = useRoute()

const recipesStore =  useRecipesStore()
const { recipe, filePath } = storeToRefs(recipesStore)
const { getRecipeById, deleteRecipeById, toggleFavorite } = recipesStore

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
  <section 
    v-if="!recipe.error" 
    class="recipe"
  >
    <h1>{{ recipe.title }}</h1>
    <p>Ингредиенты: {{ recipe.ingredients }}</p>
    <p>Инструкции: {{ recipe.instructions }}</p>
    <ul v-if="recipe.links">
      <li
        v-for="link in links"
        :key="link"
      >
        <a
          :href="link"
          target="_blank"
          class="link"
        >{{ link }}</a>
      </li>
    </ul>
    <p v-if="recipe.comment">Комментарий: {{ recipe.comment }}</p>
    <a
      v-if="filePath"
      :href="filePath"
      target="_blank"
      class="link"
    >Открыть файл</a>
    <div class="wrapper">
      <button type="button">
        <RouterLink :to="`/recipes/${recipe.id}/edit`">Редактировать</RouterLink>
      </button>
      <button 
        type="button"
        @click="toggleFavorite(recipe)"
        :class="{ 'favorite': recipe.favorite }"
      >
        {{ recipe.favorite ? 'Убрать из избранного' : 'Добавить в избранное' }}
      </button>
      <button type="button">Добавить комментарий</button>
      <button
        type="button"
        @click="deleteRecipe(recipe.id)"
      >Удалить</button>
    </div>
  </section>
  <section v-else>
    <CommonError :error="recipe.error" />
  </section>
</template>

<style scoped>
.recipe {
  & .link {
    color: inherit;
  }
}

.wrapper {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}

.wrapper button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.wrapper button:hover {
  background-color: var(--color-border);
}

.wrapper button.favorite {
  background-color: #ffd700;
  border-color: #ffd700;
  color: #333;
}

.wrapper button.favorite:hover {
  background-color: #ffed4e;
}
</style>