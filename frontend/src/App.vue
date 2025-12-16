<script setup>
import CommonHeader from '@/components/common/CommonHeader.vue'
// import CommonFooter from '@/components/common/CommonFooter.vue'
</script>

<template>
  <div class="container">
    <CommonHeader />
    <main class="main">
      <transition>
        <RouterView v-slot="{ Component }">
          <component :is="Component" />
        </RouterView>
      </transition>
    </main>
    <!-- <CommonFooter /> -->
  </div>
</template>

<style scoped>
.main {
  padding-block: 2rem;

  @media (width < 768px) {
    padding-block: 1rem;
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
