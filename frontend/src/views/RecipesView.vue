<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { useCategoriesStore } from '@/stores/categories'
import { useRecipesStore } from '@/stores/recipes'
import RecipesList from '@/components/recipes/RecipesList.vue'
import RecipesCategories from '@/components/recipes/RecipesCategories.vue'

const router = useRouter()

const goToCreateRecipe = () => {
  router.push({ path: '/recipes/create' })
}

const categoriesStore = useCategoriesStore()
const { getCategories } = categoriesStore

const recipesStore = useRecipesStore()
const { category_params, ingredientsSearch, recipes } = storeToRefs(recipesStore)
const { getRecipes, clearCategoryParams } = recipesStore

const titleSearch = ref('')
const filteredRecipes = ref([])

const getRecipesByCategory = async (category={id: '', name: ''}) => {
  titleSearch.value = ''
  ingredientsSearch.value = ''
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
  if (!titleSearch.value.length) return
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
    <RecipesCategories
      @getRecipesByCategory="getRecipesByCategory"
    />
    <div class="content">
      <div class="search">
        <div class="search__container">
          <label for="title"
                 class="search__label"
          >Поиск по названию</label>
          <input
            id="title"
            type="text"
            v-model.lazy="titleSearch"
            placeholder="Поиск по названию"
            class="search__input"
            maxlength="100"
            @focusin="clearSearch"
            @keyup.enter="searchRecipesByTitle"
          >
          <div class="search__controls">
            <div
              class="search__close"
              @click="clearSearchByTitle" 
            ><img src="@/assets/icons/close.svg"
                  alt="Close"
            ></div>
          </div>
          <div
            class="search__search"
            @click="searchRecipesByTitle"
          ><img src="@/assets/icons/search.svg"
                alt="Search"
          ></div>
        </div>
        <div class="search__container">
          <label for="ingredients"
                 class="search__label"
          >Поиск по ингредиентам</label>
          <input
            id="ingredients"
            type="text"
            v-model.lazy="ingredientsSearch"
            placeholder="Поиск по ингредиентам"
            class="search__input"
            maxlength="100"
            @focusin="clearSearchByTitle"
            @keyup.enter="searchRecipes"
          >
          <div class="search__controls">
            <div
              class="search__close"
              @click="clearSearch" 
            ><img src="@/assets/icons/close.svg"
                  alt="Close"
            ></div>
          </div>
          <div
            class="search__search"
            @click="searchRecipes"
          ><img src="@/assets/icons/search.svg"
                alt="Search"
          ></div>
        </div>
      </div>
      <button
        @click="goToCreateRecipe"
        type="button" 
        class="actions"
      >
        Добавить рецепт
      </button>

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
  grid-template-areas: "aside content";
}

@media (width < 600px) {
  .parent {
    grid-template-areas: "aside aside"
                         "content content";}
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  grid-area: content;
}

.search {
  display: flex;
  flex-direction: column;
}

.search__container {
  display: grid;
  grid-template-columns: 1fr auto auto;
  grid-template-rows: 1fr auto;
  margin-bottom: 1rem;
}

.search__label {
  grid-row: 1 / 2;
}

.search__input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  grid-column: 1 / 3;
  grid-row: 2 / 3;
  padding-inline-end: calc(2rem + 24px);
}

.search__controls {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  display: flex;
  place-content: center;
  gap: 1rem;
}

.search__close,
.search__search {
  cursor: pointer;
  display: flex;
  align-Items: center; 
  justify-content: center;
    padding-inline: 1rem;
}

.search__close > img,
.search__search > img {
  width: 24px;
  height: 24px;
}

.search__search {
  grid-column: 3 / 4;
  grid-row: 2 / 3;
}
</style>