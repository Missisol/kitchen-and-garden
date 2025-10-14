<script setup>
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useRecipesStore } from '@/stores/recipes'
import { computed } from 'vue'

const recipesStore = useRecipesStore()
const { category_params } = storeToRefs(recipesStore)
const { addToFavorites, removeFromFavorites } = recipesStore


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

const toggleFavorite = async (item) => {
  try {
    if (item.favorite) {
      await removeFromFavorites(item.id)
    } else {
      await addToFavorites(item.id)
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
  }
}
</script>

<template>
  <section class="recipes">
    <h2 class="title">Рецепты: {{ recipesTitle }}</h2>
    <h2
      v-if="ingredientsSearch"
      class="title"
    >Ингредиенты: {{ ingredientsSearch }}</h2>
    <ul class="list">
      <li
        v-for="item in filteredRecipes"
        :key="item.id"
        class="item"
      >
        <RouterLink :to="`/recipes/${item.id}`">
          <div class="title">{{ item.title }}</div>
          <div><span class="label">Ингредиенты:</span> {{ item.ingredients }}</div>
          <div><span class="label">Инструкции:</span> {{ item.instructions }}</div>
          <div><span class="label">Ссылки:</span> {{ item.links }}</div>
          <div><span class="label">Категория:</span> {{ item.category_name || 'Без категории' }}</div>
          <div><span class="label">Избранное:</span> {{ item.favorite ? 'Да' : 'Нет' }}</div>
        </RouterLink>
        <button
          type="button"
          class="favorite-btn"
          :class="{ favorite: item.favorite }"
          @click.prevent.stop="toggleFavorite(item)"
        >
          {{ item.favorite ? 'Убрать из избранного' : 'Добавить в избранное' }}
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.recipes {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.item {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  color: var(--color-text);
  background-color: var(--color-background-soft);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.item a {
  color: inherit;
  text-decoration: none;
  display: block;
}

.item div {
  margin-bottom: 0.75rem;
}

.item div:last-child {
  margin-bottom: 0;
}

.title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--color-heading);
}

.label {
  font-weight: 600;
  margin-right: 0.5rem;
}

.favorite-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.favorite-btn:hover {
  background-color: var(--color-background-soft);
  border-color: var(--color-border-hover);
}

.favorite-btn.favorite {
  background-color: #ff6b6b;
  color: white;
  border-color: #ff6b6b;
}

.favorite-btn.favorite:hover {
  background-color: #ff5252;
  border-color: #ff5252;
}
</style>