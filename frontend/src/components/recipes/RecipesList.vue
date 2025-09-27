<script setup>
import { RouterLink } from 'vue-router'

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
</script>

<template>
  <section class="categories">
    <h2 v-if="titleSearch"
        :class="['title', titleSearch && 'active']"
    >Рецепты: {{ titleSearch }}</h2>
    <h2 v-if="ingredientsSearch"
        :class="['title', ingredientsSearch && 'active']"
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

.title {

  &.active {
    color: var(--color-text);
  }
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