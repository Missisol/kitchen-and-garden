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
    <ul>
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
}

.category {
  cursor: pointer;
  padding: 0.5rem 0;
}

.category--active {
 color: var(--green);
 text-decoration: underline;
}

.category:hover {
  background-color: #f0f0f0; 
}
</style>