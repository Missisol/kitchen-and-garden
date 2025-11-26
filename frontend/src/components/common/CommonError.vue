<script setup>
const { error } = defineProps({
  error: String
})
</script>

<template>
  <div>
    
    <p>{{ error }}</p>
  </div>
</template>

<style scoped></style>