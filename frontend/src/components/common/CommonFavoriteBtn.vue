<script setup>
import IconStar from '../icons/IconStar.vue'
import { useRecipesStore } from '@/stores/recipes'

const { recipe } = defineProps({
  recipe: {
    type: Object,
    required: true
  }
})

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