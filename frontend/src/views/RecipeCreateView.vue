<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { useCategoriesStore } from '@/stores/categories'
import { useRecipesStore } from '@/stores/recipes'

import RecipeForm from '@/components/recipes/RecipeForm.vue'
import CommonButton from '@/components/common/CommonButton.vue'
import IconArrowLeft from '@/components/icons/IconArrowLeft.vue'

const router = useRouter()
const categoriesStore = useCategoriesStore()
const { categories } = storeToRefs(categoriesStore)
const { getCategories } = categoriesStore
const recipesStore = useRecipesStore()
const { createRecipe, uploadFile } = recipesStore

const data = ref({
  title: '',
  ingredients: '',
  instructions: '',
  links: '',
  comment: '',
})
const fileModel = ref({})

if (!categories.value.length) {
  getCategories()
}

async function getFormBody() {
  console.log('data', data.value)

  if (!data.value.title) {
    return
  }

  if (data.value.ingredients) {
    data.value.ingredients = data.value.ingredients.toLowerCase()
  }

  if (fileModel.value.file) {
    const formData = new FormData()
    formData.append('file', fileModel.value.file)
    const result = await uploadFile(formData)
    data.value.file = result.filename  // Сохраняем только имя файла
  }
  console.log('data', data.value)
  create()
}

async function create() {
  const result = await createRecipe(data.value)
    if (result.id) {
    router.push({ path: '/recipes' })
  }
}
</script>

<template>
  <div class="content">
    <div class="button-back">
      <CommonButton @buttonAction="router.push({ path: '/recipes' })">
        <template #icon><IconArrowLeft /></template>
        <template #text>Назад к рецептам</template>
      </CommonButton>
    </div>
    <section class="recipe">
      <RecipeForm
        v-model:model="data"
        v-model:fileModel="fileModel"
        :categories="categories"
        @getFormBody="getFormBody"
      />
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
</style>