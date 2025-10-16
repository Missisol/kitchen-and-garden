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
import IconChefhat from '@/components/icons/IconChefhat.vue'
import CommonHero from '@/components/common/CommonHero.vue'

const router = useRouter()

const goToCreateRecipe = () => {
  router.push({ path: '/recipes/create' })
}

const categoriesStore = useCategoriesStore()
const { getCategories } = categoriesStore

const recipesStore = useRecipesStore()
const { category_params, ingredientsSearch, recipes } = storeToRefs(recipesStore)
const { getRecipes, getFavoriteRecipes, clearCategoryParams } = recipesStore

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
  await getFavoriteRecipes()
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
    <CommonHero>
      <template #icon>
        <IconChefhat />
      </template>
      <template #title>Рецепты</template>
      <template #text>Управляйте своими рецептами</template>
    </CommonHero>
    <RecipesCategories
      @getRecipesByCategory="getRecipesByCategory"
    />
    <div class="content">
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
      <div class="add-recipe">
        <CommonButton
          buttonType="button"
          :buttonAction="getFavoriteRecipesList"
        >
          Избранные рецепты
        </CommonButton>
        <CommonButton
          buttonType="button"
          :buttonAction="goToCreateRecipe"
        >
          Добавить рецепт
        </CommonButton>
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
  display: flex;
  flex-wrap: wrap;
}

.add-recipe {
  --padding: 4px 16px;
  align-self: end;
  display: flex;
  gap: 1rem;
}
</style>