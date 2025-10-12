<script setup>
import { storeToRefs } from 'pinia'

import CategoryCreate from '@/components/category/CategoryCreate.vue'
import CategoryDelete from '@/components/category/CategoryDelete.vue'
import { useCategoriesStore } from '@/stores/categories'
import { useRecipesStore } from '@/stores/recipes'

const categoriesStore = useCategoriesStore()
const { categories } = storeToRefs(categoriesStore)

const recipesStore = useRecipesStore()
const { category_params } = storeToRefs(recipesStore)

const emit = defineEmits(['getRecipesByCategory'])
</script>

<template>
  <aside class="aside">
    <h2>Категории</h2>
    <ul class="categories">
      <li
        :class="category_params.id === '' ? 'category--active' : ''"
        class="category"
        @click="emit('getRecipesByCategory')"
      >Все</li>
      <li
        v-for="category in categories"
        :key="category.id"
        :class="category_params.id === category.id ? 'category--active' : ''"
        class="category"
        @click="emit('getRecipesByCategory', category)"
      >
        {{ category?.name ||'Без категории' }}
      </li>
    </ul>
    <CategoryCreate />
    <CategoryDelete />
  </aside>

</template>

<style scoped>
.aside {
  grid-area: aside;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.categories {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media(width < 600px) {
    flex-direction: row;
    flex-wrap: wrap;
    gap: .5rem 2rem;
  }
}

.category {
  cursor: pointer;

  @media(width < 600px) {
    min-width: fit-content;
  }
}

.category--active {
 color: var(--c-green);
 text-decoration: underline;
}

.category:hover {
  background-color: var(--c-green-soft); 
}
</style>