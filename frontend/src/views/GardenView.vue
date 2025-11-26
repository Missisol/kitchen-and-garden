<script setup>
import CommonHero from '@/components/common/CommonHero.vue'
import IconSprout from '@/components/icons/IconSprout.vue'
</script>

<template>
  <div class="parent">
    <CommonHero>
      <template #icon>
        <IconSprout />
      </template>
      <template #title>Сад</template>
      <template #text>Управляйте своим садом</template>
    </CommonHero>
  </div>
</template>

<style scoped>
.parent {
  --gradient: var(--gradient-secondary);
  --dim: left;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas: "hero"
                        "filter" 
                        "content";
  gap: 2rem;
}
</style>