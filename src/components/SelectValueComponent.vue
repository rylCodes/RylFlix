<template>
  <div
    class="flex items-center gap-1 cursor-pointer px-2"
    :class="props.isSelected && 'text-myViolet'"
  >
    <i v-if="props.isSelected" class="mdi mdi-plus-circle-outline"></i>
    <i
      v-if="!props.isSelected"
      class="mdi mdi-checkbox-blank-circle-outline"
    ></i>
    <span>{{ props.option }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  option: String,
  isSelected: Boolean,
});
</script>
