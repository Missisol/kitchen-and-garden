<script setup>
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
</script>

<template>
  <div class="container">
    <Header />
    <main class="main">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style scoped>
</style>
