<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { useCategoriesStore } from '@/stores/categories'
import { useRecipesStore } from '@/stores/recipes'
import RecipesList from '@/components/recipes/RecipesList.vue'
import RecipesCategories from '@/components/recipes/RecipesCategories.vue'
import RecipeSearch from '@/components/recipes/RecipeSearch.vue'
import CommonButton from '@/components/common/CommonButton.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
import IconStar from '@/components/icons/IconStar.vue'

const router = useRouter()

const goToCreateRecipe = () => {
  router.push({ path: '/recipes/create' })
}

const categoriesStore = useCategoriesStore()
const { getCategories } = categoriesStore

const recipesStore = useRecipesStore()
const { category_params, ingredientsSearch, recipes, showFavoritesOnly } = storeToRefs(recipesStore)
const { getRecipes, getFavoriteRecipes, clearCategoryParams } = recipesStore
const { totalPages,  currentPage } = storeToRefs(recipesStore)

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

const getFavoriteRecipesList = async () => {
  titleSearch.value = ''
  ingredientsSearch.value = ''
  clearCategoryParams()
  
  if (showFavoritesOnly.value) {
    await getRecipes()
  } else {
    await getFavoriteRecipes()
  }
  
  showFavoritesOnly.value = !showFavoritesOnly.value
}

const handlePageChange = async (page) => {
  await getRecipes(category_params.value.id, null, page)
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
      <div class="controls">
        <h2 class="controls__title">Рецепты</h2>
        <div class="controls__box">
          <div
            class="common-button--dark"
            :class="{'common-button--dark-active': showFavoritesOnly}"
          >
            <CommonButton
              @buttonAction="getFavoriteRecipesList"
            >
              <template #icon><IconStar /></template>
              <template #text>
                <span>Избранные</span>
              </template>
            </CommonButton>
          </div>
          <CommonButton
            @buttonAction="goToCreateRecipe"
          >
            <template #icon><IconPlus /></template>
            <template #text>
              <span>Добавить рецепт</span>
            </template>
          </CommonButton>
        </div>
      </div>
      <div class="search">
        <RecipeSearch
          :focusAction="clearSearch"
          :keyupAction="searchRecipesByTitle"
          :clearFunction="clearSearchByTitle"
          :searchFunction="searchRecipesByTitle"
          labelTitle="Поиск по названию"
          v-model="titleSearch"
        />
        <RecipeSearch
          :focusAction="clearSearchByTitle"
          :keyupAction="searchRecipes"
          :clearFunction="clearSearch"
          :searchFunction="searchRecipes"
          labelTitle="Поиск по ингредиентам"
          v-model="ingredientsSearch"
        />
      </div>
      <RecipesList 
        :filteredRecipes="filteredRecipes"
        :titleSearch="titleSearch"
        :ingredientsSearch="ingredientsSearch"
        :currentPage="currentPage"
        :totalPages="totalPages"
        @pageSelected="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped>
.parent {
  --gradient: var(--gradient-primary);
  --dim: right;

  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.search {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (width < 768px) {
    grid-template-columns: auto;
  }
}

.controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
}

.controls__box {
  --padding: 4px 16px;
  display: flex;
  gap: 1rem;
}

.controls__title {
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
  color: var(--color-heading);
}

.common-button--dark-active  svg {
  fill: var(--color-primary-foreground);
}
</style>