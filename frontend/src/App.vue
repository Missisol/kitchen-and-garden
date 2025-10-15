<script setup>
import CommonHeader from '@/components/common/CommonHeader.vue'
// import CommonFooter from '@/components/common/CommonFooter.vue'
</script>

<template>
  <div class="container">
    <CommonHeader />
    <main class="main">
      <RouterView v-slot="{ Component }">
        <component :is="Component" />
      </RouterView>
    </main>
    <!-- <CommonFooter /> -->
  </div>
</template>

<style scoped>
</style>
