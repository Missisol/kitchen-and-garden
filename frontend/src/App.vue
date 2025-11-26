<script setup>
import CommonHeader from '@/components/common/CommonHeader.vue'
// import CommonFooter from '@/components/common/CommonFooter.vue'
</script>

<template>
  <div class="container">
    <CommonHeader />
    <main class="main">
      <RouterView v-slot="{ Component }">
        <transition name="slide">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
    <!-- <CommonFooter /> -->
  </div>
</template>

<style scoped>
.main {
  padding-block: 2rem;
}

.slide-enter-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}
</style>
