<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useRecipesStore } from '@/stores/recipes'
import { storeToRefs } from 'pinia'

const { filteredRecipes } = defineProps({
  filteredRecipes: {
    type: Array,
    default: () => [],
  }
})

const recipesStore =  useRecipesStore()
const { category_params } = storeToRefs(recipesStore)

const categoryTitle = computed(() => {
  return (category_params.value.name && category_params.value.id) 
    ? category_params.value.name 
    : (category_params.value.id && !category_params.value.name) 
    ? 'Без категории' 
    : 'Все'
})
</script>

<template>
  <section class="categories">
    <h1 class="title">Категория: {{ categoryTitle }}</h1>
    <ul class="list">
      <li v-for="item in filteredRecipes"
          :key="item.id"
          class="item"
      >
        <RouterLink :to="`/recipes/${item.id}`">
          <div>title: {{ item.title }}</div>
          <div>ingredients: {{ item.ingredients }}</div>
          <div>instructions: {{ item.instructions }}</div>
          <div>links: {{ item.links }}</div>
          <div>category: {{ item.category_name || 'Без категории' }}</div>
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