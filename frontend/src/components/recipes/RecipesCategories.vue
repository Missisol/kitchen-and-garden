<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useCategoriesStore } from '@/stores/categories'
import { useRecipesStore } from '@/stores/recipes'
import CategoryCreate from '@/components/category/CategoryCreate.vue'
import CategoryManage from '@/components/category/CategoryManage.vue'
import CategoryButton from '@/components/category/CategoryButton.vue'
import TransitionDropdown from '@/components/transition/TransitionDropdown.vue'

const categoriesStore = useCategoriesStore()
const { categories } = storeToRefs(categoriesStore)

const recipesStore = useRecipesStore()
const { category_params, showFavoritesOnly, ingredientsSearch, titleSearch } = storeToRefs(recipesStore)
const { getRecipes } = recipesStore

const emit = defineEmits(['getRecipesByCategory'])
const isOpen = defineModel()

const isFiltered = computed(() => category_params.value.id !== '' || showFavoritesOnly.value || titleSearch.value || ingredientsSearch.value)
</script>

<template>
  <section class="categories">
    <h2 class="categories__title">Категории</h2>
    <ul class="categories__list">
      <li
        :class="isFiltered ? '' : 'category--active'"
        class="category"
        @click="emit('getRecipesByCategory')"
      ><CategoryButton>Все</CategoryButton></li>
      <li
        v-for="category in categories"
        :key="category.id"
        :class="category_params.id === category.id ? 'category--active' : ''"
        class="category"
        @click="emit('getRecipesByCategory', category)"
      >
        <CategoryButton>{{ category?.name ||'Без категории' }}</CategoryButton>
      </li>
    </ul>
    <TransitionDropdown v-model="isOpen">
      <template #button>Управление категориями</template>
      <div 
        v-if="isOpen"
        class="categories__action"
      >
        <CategoryCreate />
        <CategoryManage @getRecipes="getRecipes" />
      </div>
    </TransitionDropdown>
  </section>
</template>

<style scoped>
.categories {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.categories__title {
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
  color: var(--color-heading);
}

.categories__list {
  display: flex;
  gap: .5rem;
  flex-direction: row;
  flex-wrap: wrap;
}

.categories__button {
  background: transparent;
  border: none;
  color: var(--color-primary);
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  margin-block-end: 1rem;
  cursor: pointer;

  &::after {
    content: "";
    border: 6px solid transparent;
    border-top-color: currentColor;
    transform: translateY(50%);
  }

  &.open::after {
    border-top-color: transparent;
    border-bottom-color: currentColor;
    transform: translateY(-50%);
  }
}

.categories__action {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin-block-end: 1rem;

  @media (width < 768px) {
    grid-template-columns: auto;
  }
}

.category {
  cursor: pointer;
}
</style>