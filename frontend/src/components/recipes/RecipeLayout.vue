<script setup>
import CommonButton from '@/components/common/CommonButton.vue'
import IconArrowLeft from '@/components/icons/IconArrowLeft.vue'

const { text } = defineProps({
  text: {
    type: String,
    required: true,
  }
})

const emit = defineEmits(['action'])
</script>

<template>
  <div class="layout">
    <div class="button-back">
      <CommonButton @buttonAction="emit('action')">
        <template #icon><IconArrowLeft /></template>
        <template #text>{{ text }}</template>
      </CommonButton>
    </div>
    <section class="recipe">
      <slot name="recipe"></slot>
    </section>
  </div>
</template>

<style scoped>
.layout {
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