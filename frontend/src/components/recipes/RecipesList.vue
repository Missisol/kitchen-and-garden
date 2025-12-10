<script setup>
import { useRecipesStore } from '@/stores/recipes'
import RecipeCard from './RecipeCard.vue'

const recipesStore = useRecipesStore()
const { toggleFavorite } = recipesStore


const { filteredRecipes, currentPage, totalPages } = defineProps({
  filteredRecipes: {
    type: Array,
    default: () => [],
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  totalPages: {
    type: Number,
    default: 1,
  },
  titleSearch: {
    type: String,
    default: '',
  },
  ingredientsSearch: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['page-selected'])

function selectPage(page) {
  if (page !== currentPage && page >= 1 && page <= totalPages) {
    emit('page-selected', page)
  }
}
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
    <div
      class="pagination-controls"
      v-if="totalPages > 1"
    >
      <button
        class="pagination-btn"
        :disabled="currentPage === 1"
        @click="selectPage(currentPage - 1)"
      >Назад</button>
      <button
        v-for="page in totalPages"
        :key="page"
        class="pagination-page-btn"
        :class="{'active': page === currentPage}"
        @click="selectPage(page)"
      >{{ page }}</button>
      <button
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        @click="selectPage(currentPage + 1)"
      >Вперёд</button>
    </div>
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

  @media (width < 768px) {
    grid-template-columns: auto;
  }
}

.card {
  color: var(--color-card-foreground);
  background: var(--color-gradient-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  transition: var(--transition-smooth);
}

@media (hover: hover) and (pointer: fine) {
  .card:hover {
    box-shadow: var(--shadow-glow);
    border: 1px solid hsl(from var(--color-primary) h s l / 0.5);
  }
}

.card a {
  color: inherit;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
}

.pagination-controls {
  /* align like CommonButton wrappers */
  --cbtn-background: var(--color-background);
  --cbtn-border: var(--color-input);
  --text-color: var(--color-foreground);
  --cbtn-hover: var(--color-primary);
  --text-hover: var(--color-primary-foreground);

  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-btn,
.pagination-page-btn {
  background: var(--cbtn-background, var(--color-primary));
  color: var(--text-color, var(--color-primary-foreground));
  border: 1px solid var(--cbtn-border, var(--color-primary));
  border-radius: calc(var(--radius) - 2px);
  padding-block: .5rem;
  padding-inline: 1rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: .875rem;
  line-height: 1.5rem;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: var(--transition-smooth);
}

@media (hover: hover) and (pointer: fine) {
  .pagination-btn:not(:disabled):hover,
  .pagination-page-btn:not(:disabled):hover {
    --cbtn-fallback: var(--cbtn-background, var(--color-primary));
    background: var(--cbtn-hover, hsl(from var(--cbtn-fallback) h s l / 0.9));
    color: var(--text-hover, var(--color-primary-foreground));
  }
}

.pagination-btn:disabled,
.pagination-page-btn:disabled {
  background: hsl(from var(--cbtn-background) h s l / 0.1);
  color: hsl(from var(--text-color) h s l / 0.3);
  cursor: not-allowed;
}

.pagination-page-btn.active {
  background: var(--cbtn-hover, var(--color-primary));
  color: var(--text-hover, var(--color-primary-foreground));
  border-color: var(--cbtn-hover, var(--color-primary));
}
</style>