<script setup>
import { storeToRefs } from 'pinia'

import CategoryCreate from '@/components/category/CategoryCreate.vue'
import CategoryDelete from '@/components/category/CategoryDelete.vue'
import { useCategoriesStore } from '@/stores/categories'
import { useRecipesStore } from '@/stores/recipes'
import CategoryButton from '../category/CategoryButton.vue'

const categoriesStore = useCategoriesStore()
const { categories } = storeToRefs(categoriesStore)

const recipesStore = useRecipesStore()
const { category_params } = storeToRefs(recipesStore)

const emit = defineEmits(['getRecipesByCategory'])
</script>

<template>
  <section class="categories">
    <h2 class="categories__title">Категории</h2>
    <ul class="categories__list">
      <li
        :class="category_params.id === '' ? 'category--active' : ''"
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
    <div class="categories__action">
      <CategoryCreate />
      <CategoryDelete />
    </div>
  </section>

</template>

<style scoped>
.categories {
  grid-area: filter;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.categories__title {
  color: var(--color-heading);
}

.categories__list {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-direction: row;
  flex-wrap: wrap;
}

.categories__action {
  display: flex;
  flex-wrap: wrap;
  /* flex-direction: column; */
  gap: 1rem;
}

.category {
  cursor: pointer;
}
</style>