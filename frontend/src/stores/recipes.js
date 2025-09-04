import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRecipesStore = defineStore('recipes', () =>{
  const params = ref({
    id: '',
    name: '',
  })

  return {
    params
  }
})