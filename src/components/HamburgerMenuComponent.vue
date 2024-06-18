<template>
  <div class="py-4 pr-2">
    <div tabindex="0" class="relative group h-[1.125rem] w-7">
      <span
        class="group-hover:bg-violet-500 absolute -translate-y-1/2 left-0 h-[0.1875rem] w-full transition-all duration-300"
        :class="
          props.isNavBarOpen
            ? 'top-1/2 rotate-45 bg-violet-500'
            : 'top-0 rotate-0 bg-gray-50'
        "
      >
      </span>
      <span
        class="group-hover:bg-violet-500 absolute -translate-y-1/2 top-1/2 left-0 h-[0.1875rem] w-full bg-gray-50 transition-all duration-300"
        :class="props.isNavBarOpen ? 'hidden' : ''"
      >
      </span>
      <span
        class="group-hover:bg-violet-500 absolute -translate-y-1/2 left-0 h-[0.1875rem] w-full transition-all duration-300"
        :class="
          props.isNavBarOpen
            ? 'top-1/2 -rotate-45 bg-violet-500'
            : 'top-full rotate-0 bg-gray-50'
        "
      >
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["isNavBarOpen"]);
</script>
