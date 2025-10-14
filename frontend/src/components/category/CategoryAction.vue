<script setup>
import CommonButton from '../common/CommonButton.vue'

const { title, idName, buttonTitle } = defineProps({
  title: {
    type: String,
    default: ' ',
  },
  idName: {
    type: String,
    default: 'cat',
  },
  buttonTitle: {
    type: String,
    default: ' ',
  }
})

const emit = defineEmits(['submitAction'])
</script>

<template>
  <section class="action">
    <!-- <h4>{{ title }}</h4> -->
    <form
      class="action__form"
      @submit="emit('submitAction', $event)"
    >
      <label 
        :for="idName" 
        class="action__label"
      >{{ title }}
        <div class="action__slot">
          <slot></slot>
        </div>
      </label>
      <div class="action__button">
        <CommonButton :buttonType="'submit'">{{ buttonTitle }}</CommonButton>
      </div>
    </form>
  </section>
</template>

<style scoped>
.action__form {
  display: grid;
  grid-template-columns: 260px;
  grid-template-areas: 
          "label button";
  /* align-items: end; */

  display: flex;
  flex-direction: column;
  gap: .5rem 1rem;

  @media (width < 500px) {
    display: flex;
    flex-wrap: wrap;
  }
}

.action__label {
  grid-area: label;
  font-weight: bold;
  width: 260px;
}

.action__slot {
  display: flex;
  height: 32px;
}

.action__slot > * {
  border-radius: 4px;
  width: 100%;
}

.action__button {
  --padding: 2px 16px;
  grid-area: button;
  /* align-self: end;
 */}
</style>