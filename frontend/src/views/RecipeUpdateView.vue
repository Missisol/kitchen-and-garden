<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { useCategoriesStore } from '@/stores/categories'
import { useRecipesStore } from '@/stores/recipes'

import RecipeLayout from '@/components/recipes/RecipeLayout.vue'
import RecipeForm from '@/components/recipes/RecipeForm.vue'
import CommonError from '@/components/common/CommonError.vue'
import CommonFavoriteBtn from '@/components/common/CommonFavoriteBtn.vue'

const router = useRouter()
const categoriesStore = useCategoriesStore()
const { categories } = storeToRefs(categoriesStore)
const { getCategories } = categoriesStore

const recipesStore =  useRecipesStore()
const { recipe } = storeToRefs(recipesStore)
const { getRecipeById, updateRecipe, uploadFile } = recipesStore

const id = router.currentRoute.value.params.id
const data = ref({
  title: '',
  ingredients: '',
  instructions: '',
  links: '',
  comment: '',
  category_id: '',
})
const fileModel = ref({})
const body = ref({})

getRecipeById(id)

if (!categories.value.length) {
  getCategories()
}

async function getFormBody() {
  console.log('data', data.value)

  data.value.title = data.value.title.toLowerCase()

    if (data.value.ingredients) {
    data.value.ingredients = data.value.ingredients.toLowerCase()
  }

  if (fileModel.value.file) {
    const formData = new FormData()
    formData.append('file', fileModel.value.file)
    const result = await uploadFile(formData)
    data.value.file = result.filename
  }

  for ( const [key, value] of Object.entries(data.value)) {
    if (value !== recipe.value[key]) {
      body.value[key] = key === 'ingredients' ? value.toLowerCase() : value
    }
  }
  // console.log('body', body.value)
  update(id, body.value)
}

async function update(id, body) {
  const result = await updateRecipe(id, body)
  if (result.id) {
    router.push({ path: `/recipes/${id}` })
  }
}

watch(() => recipe.value, () => {
  data.value = {
    title: recipe.value.title,
    ingredients: recipe.value.ingredients,
    instructions: recipe.value.instructions,
    links: recipe.value.links,
    comment: recipe.value.comment,
    category_id: recipe.value.category_id,
    file: recipe.value?.file
  }
})
</script>

<template>
  <RecipeLayout
    @action="router.push({ path: `/recipes/${id}`})"
    text="Назад к рецепту"
  >
    <template 
      v-if="!recipe.error" 
      #recipe
    >
      <div class="recipe__heading">
        <h1 class="recipe__title">{{ recipe.title }}</h1>
        <CommonFavoriteBtn :recipe="recipe" />
      </div>
      <RecipeForm
        v-model:model="data"
        v-model:fileModel="fileModel"
        :categories="categories"
        @getFormBody="getFormBody"
      />
    </template>
    <template
      v-else
      #recipe
    >
      <CommonError :error="recipe.error" />
    </template>
  </RecipeLayout>
</template>

<style scoped>
.recipe__heading {
  --size-icon: 1.75rem;

  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-block-end: 1.25rem;
}

.recipe__title {
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 2.25rem;
}

</style>