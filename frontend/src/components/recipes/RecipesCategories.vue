<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import CategoryCreate from '@/components/category/CategoryCreate.vue'
import CategoryManage from '@/components/category/CategoryManage.vue'

import { useCategoriesStore } from '@/stores/categories'
import { useRecipesStore } from '@/stores/recipes'
import CategoryButton from '../category/CategoryButton.vue'

const categoriesStore = useCategoriesStore()
const { categories } = storeToRefs(categoriesStore)

const recipesStore = useRecipesStore()
const { category_params } = storeToRefs(recipesStore)
const { getRecipes } = recipesStore

const emit = defineEmits(['getRecipesByCategory'])

const isOpen = ref(false)
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
    <div class="categories__action-box">
      <button 
        :class="[isOpen ? 'open' : '', 'categories__button']" 
        @click="isOpen = !isOpen"
      >
        Управление категориями
      </button>
      <Transition name="cat">
        <div 
          v-if="isOpen"
          name="cat" 
          class="categories__action"
        >
          <CategoryCreate />
          <CategoryManage @getRecipes="getRecipes" />
        </div>
      </Transition>
    </div>
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
  /* justify-content: center; */
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

  @media (width < 768px) {
    grid-template-columns: auto;
  }
}

.category {
  cursor: pointer;
}

.cat-enter-active, .cat-leave-active {
  transition: height .2s ease, opacity .2s ease;
}

.cat-enter-from, .cat-leave-to {
  height: 0;
  opacity: 0;
}
</style>