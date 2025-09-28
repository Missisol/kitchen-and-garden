<script setup>
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useRecipesStore } from '@/stores/recipes'
import { computed } from 'vue'

const recipesStore = useRecipesStore()
const { category_params } = storeToRefs(recipesStore)

const { filteredRecipes, titleSearch, ingredientsSearch } = defineProps({
  filteredRecipes: {
    type: Array,
    default: () => [],
  }, 
  titleSearch: {
    type: String,
    default: '',
  }, 
  ingredientsSearch: {
    type: String,
    default: '',
  }
})

const recipesTitle = computed(() => {
  return titleSearch ? titleSearch : category_params.value?.name ? category_params.value.name : category_params.value?.id ? 'Без категории' : 'Все'
})
</script>

<template>
  <section class="categories">
    <h2 class="title">Рецепты: {{ recipesTitle }}</h2>
    <h2 v-if="ingredientsSearch"
        class="title"
    >Ингредиенты: {{ ingredientsSearch }}</h2>
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