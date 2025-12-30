<script setup lang="ts">
import IconStar from '../icons/IconStar.vue'
import { useRecipesStore } from '@/stores/recipes'
import type { Recipe } from '@/types/recipe'

const { recipe } = defineProps<{
  recipe: Recipe
}>()

const recipesStore =  useRecipesStore()
const { toggleFavorite } = recipesStore

</script>

<template>
  <button
    type="button"
    class="favorite-btn"
    aria-label="Favorite"
    :class="{ favorite: recipe.favorite }"
    @click.prevent.stop="toggleFavorite(recipe)"
  >
    <IconStar />
  </button>
</template>

<style scoped>
.favorite-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  transition: var(--transition-smooth);
  padding: 2px;
}

.favorite-btn svg {
  width: var(--size-icon, 1.25rem);
  height: var(--size-icon, 1.25rem);
}

.favorite-btn.favorite svg {
  color: var(--color-primary);
fill: var(--color-primary);
}

@media (hover: hover) and (pointer: fine) {
  .favorite-btn:hover {
    transform: scale(1.1)
  }
}
</style>