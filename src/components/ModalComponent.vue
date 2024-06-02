<template>
  <div
    @click="closeModal($event)"
    v-if="state"
    class="fixed top-0 left-0 flex justify-center items-center h-full w-full bg-[rgba(0,0,0,0.5)] z-50"
  >
    <div ref="modalContainer mx-4">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  state: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["update:state"]);

const modalContainer = ref(null);

const closeModal = (event) => {
  if (modalContainer.value && !modalContainer.value.contains(event.target)) {
    emits("update:state", false);
  }
};
</script>
