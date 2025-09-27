<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useCategoriesStore } from '@/stores/categories'
import { useRecipesStore } from '@/stores/recipes'
import RecipesList from '@/components/recipes/RecipesList.vue'
import CategoryCreate from '@/components/category/CategoryCreate.vue'
import CategoryDelete from '@/components/category/CategoryDelete.vue'
import IconClose from '@/components/icons/IconClose.vue'
import IconSearch from '@/components/icons/IconSearch.vue'

const categoriesStore = useCategoriesStore()
const { categories } = storeToRefs(categoriesStore)
const { getCategories } = categoriesStore

const recipesStore = useRecipesStore()
const { category_params, ingredientsSearch, recipes } = storeToRefs(recipesStore)
const { getRecipes, clearCategoryParams } = recipesStore

const titleSearch = ref('')
const filteredRecipes = ref([])

const getRecipesByCategory = async (category={id: '', name: ''}) => {
  category_params.value = category?.id ? {id: category.id, name: category.name} : { id: '', name: '' }
  await getRecipes(category.id)
}

const getRecipesByTitle = () => {
  filteredRecipes.value = titleSearch.value ? recipes.value.filter(item => item.title.toLowerCase().includes(titleSearch.value.toLowerCase())) : recipes.value
}

const clearSearch = () => {
  if (ingredientsSearch.value.length) {
    ingredientsSearch.value = ''
    getRecipes()
  }
}

const clearSearchByTitle = () => {
  if (titleSearch.value.length) {
    titleSearch.value = ''
    getRecipes()
  }
}

const searchRecipes = () => {
  clearCategoryParams()
  getRecipes()
}

const searchRecipesByTitle = async() => {
  clearCategoryParams()
  await getRecipes()
  getRecipesByTitle()
}

getCategories()
getRecipes()

watch(recipes, () => {
  filteredRecipes.value = recipes.value
})

onBeforeUnmount(() => {
  ingredientsSearch.value = ''
  titleSearch.value = ''
  clearCategoryParams()
})
</script>

<template>
  <div class="parent">
    <aside class="aside">
      <h2>Categories</h2>
      <ul>
        <li
          :class="category_params.id === '' ? 'category--active' : ''"
          class="category"
          @click=getRecipesByCategory()
        >Все</li>
        <li
          v-for="category in categories"
          :key="category.id"
          :class="category_params.id === category.id ? 'category--active' : ''"
          class="category"
          @click=getRecipesByCategory(category)
        >
          {{ category?.name ||'Без категории' }}
        </li>
      </ul>
      <CategoryCreate />
      <CategoryDelete />
    </aside>
    <div class="content">
      <div class="search">
        <div class="search__container">
          <input
            type="text"
            v-model.lazy="titleSearch"
            placeholder="Поиск по названию"
            class="search__input"
            @focusin="clearSearch"
            @keyup.enter="searchRecipesByTitle"
          >
          <div
            class="search__close"
            @click="clearSearchByTitle" 
          ><IconClose /></div>
          <div
            class="search__search"
            @click="searchRecipesByTitle"
          ><IconSearch /></div>
        </div>
        <div class="search__container">
          <input
            type="text"
            v-model.lazy="ingredientsSearch"
            placeholder="Поиск по ингредиентам"
            class="search__input"
            @focusin="clearSearchByTitle"
            @keyup.enter="searchRecipes"
          >
          <div
            class="search__close"
            @click="clearSearch" 
          ><IconClose /></div>
          <div
            class="search__search"
            @click="searchRecipes"
          ><IconSearch /></div>
        </div>

      </div>
      <RecipesList 
        :filteredRecipes="filteredRecipes"
        :titleSearch="titleSearch"
        :ingredientsSearch="ingredientsSearch"
      />
    </div>
  </div>
</template>

<style scoped>
.parent {
  display: grid;
  grid-template-columns: 1fr 3fr;
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
  /* background-color: #f0f0f0; */
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search {
  display: flex;
  flex-direction: column;
}

.search__container {
  display: grid;
  grid-template-columns: 1fr 30px 40px;
  margin-bottom: 1rem;
}

.search__input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  grid-column: 1 / 4;
  grid-row: 1 / 2;
}

.search__close,
.search__search {
  cursor: pointer;
  grid-row: 1 / 2;
  display: flex;
  align-Items: center; 
  justify-content: center;
}

.search__close {
  grid-column: 2 / 3;
}

.search__search {
  grid-column: 3 / 4;
}

.search__close > svg,
.search__search > svg {
  width: 24px;
  height: 24px;
}
</style>