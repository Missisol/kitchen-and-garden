<script setup>
import { useRecipesStore } from '@/stores/recipes'
import RecipeCard from './RecipeCard.vue'

const recipesStore = useRecipesStore()
const { toggleFavorite } = recipesStore


const { filteredRecipes } = defineProps({
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
  <div class="recipes">
    <ul class="list">
      <li
        v-for="item in filteredRecipes"
        :key="item.id"
        class="card"
      >
        <RecipeCard
          :item="item"
          :toggleFavorite="toggleFavorite"
        />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.recipes {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}

.card {
  color: var(--color-card-foreground);
  background: var(--color-gradient-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  transition: var(--transition-smooth);
}

.card:hover {
  box-shadow: var(--shadow-glow);
  border: 1px solid hsl(from var(--color-primary) h s l / 0.5);
}

.card a {
  color: inherit;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
}
</style>