<script setup>
import { ref, onBeforeMount, watch } from 'vue'
import { useRecipesStore } from '@/stores/recipes'
import { storeToRefs } from 'pinia'


const data = ref([])
const store =  useRecipesStore()
const { params } = storeToRefs(store)

console.log('log store', store.params)

watch(() => params.value, async (n, o) => {
  console.log('store', `params:${params.value.id}` , `n:${n.id}`, `o:${o.id}`)
  if (n.id !== o.id) {
    const res = await fetch(`http://localhost:5002/recipes?id=${params.value.id}`)
    data.value = await res.json()
    console.log('data_value', data.value)
    
  }
})



onBeforeMount(async () => {
  
  const res = await fetch(`http://localhost:5002/recipes?`)
  data.value = await res.json()

  console.log('data', data.value)
  
})
</script>

<template>
  <section class="categories">
    <h1 class="title">Категория: {{ params?.name || 'Все' }}</h1>
    <div class="list">
        <div v-for="item in data" :key="item.id" class="item">
        <div>title: {{ item.title }}</div>
        <div>ingredients: {{ item.ingredients }}</div>
        <div>instructions: {{ item.instructions }}</div>
        <div>links: {{ item.links }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.categories {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.list {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.item {
  border: 1px solid var(--color-border);
  padding: 1rem;
}
</style>