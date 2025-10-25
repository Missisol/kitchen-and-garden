<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { useCategoriesStore } from '@/stores/categories'
import { useRecipesStore } from '@/stores/recipes'

import RecipeForm from '@/components/recipes/RecipeForm.vue'
import CommonError from '@/components/common/CommonError.vue'
import CommonButton from '@/components/common/CommonButton.vue'
import CommonFavoriteBtn from '@/components/common/CommonFavoriteBtn.vue'
import IconArrowLeft from '@/components/icons/IconArrowLeft.vue'

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

// TODO нужно отправлять только те поля, которые изменились
async function getFormBody() {
  console.log('data', data.value)

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
  console.log('body', body.value)
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
  <div class="content">
    <div class="button-back">
      <CommonButton @buttonAction="router.push({ path: `/recipes/${id}` })">
        <template #icon><IconArrowLeft /></template>
        <template #text>Назад к рецепту</template>
      </CommonButton>
    </div>
    <section 
      v-if="!recipe.error" 
      class="recipe"
    >
      <div class="recipe__heading">
        <h1 class="recipe__title">{{ recipe.title }}</h1>
        <CommonFavoriteBtn :recipe="recipe" />
      </div>
      <RecipeForm
        v-model:model="data"
        v-model:fileModel="fileModel"
        :categories="categories"
        mode="update"
        @getFormBody="getFormBody"
      />
    </section>
    <section v-else>
      <CommonError :error="recipe.error" />
    </section>
  </div>
</template>

<style scoped>
.content {
  max-width: 56rem;
  margin-inline: auto;
}

.button-back {
  margin-block-end: 1.5rem;
  --cbtn-background: var(--color-background);
  --cbtn-border: var(--color-background);
  --text-color: var(--color-foreground);
  --cbtn-hover: var(--color-primary);
  --text-hover: var(--color-primary-foreground);
}

.recipe {
  background: var(--color-gradient-card);
  box-shadow: var(--shadow-card);
  padding: 2rem;
  border: 1px solid hsl(from var(--color-border) h s l / 0.5);
  border-radius: var(--radius);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

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