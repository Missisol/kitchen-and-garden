<script setup>
import { watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useRecipesStore } from '@/stores/recipes'
import { storeToRefs } from 'pinia'


const recipesStore =  useRecipesStore()
const { category_params, recipes } = storeToRefs(recipesStore)
const { getRecipes } = recipesStore

console.log('log store', recipesStore.params)

getRecipes()

watch(() => category_params.value, async (n, o) => {
  console.log('store', `params:${category_params.value.id}` , `n:${n.id}`, `o:${o.id}`)
  if (n.id !== o.id) {
    getRecipes(n.id)
  }
})
</script>

<template>
  <section class="categories">
    <h1 class="title">Категория: {{ category_params?.name || 'Все' }}</h1>
    <ul class="list">
      <li v-for="item in recipes" :key="item.id" class="item">
        <RouterLink :to="`/recipes/${item.id}`">
          <div>title: {{ item.title }}</div>
          <div>ingredients: {{ item.ingredients }}</div>
          <div>instructions: {{ item.instructions }}</div>
          <div>links: {{ item.links }}</div>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.categories {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.list {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.item {
  border: 1px solid var(--color-border);
  padding: 1rem;
  color: var(--color-text);

  & a {
    color: inherit;
    text-decoration: none;
  }
}
</style>