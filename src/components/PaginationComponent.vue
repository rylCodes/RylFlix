<template>
  <div class="flex items-center w-fit mt-12 mx-auto text-sm">
    <button
      v-if="currentPage > 1"
      class="px-4 py-2 border border-gray-700 rounded-l-xl enabled:hover:bg-myViolet enabled:hover:text-gray-100 transition-colors duration-300 disabled:opacity-50"
      type="button"
      @click="onFirstPage"
    >
      <i class="fa-solid fa-angles-left"></i>
    </button>
    <button
      :disabled="currentPage === 1"
      class="px-4 py-2 border border-gray-700 enabled:hover:bg-myViolet enabled:hover:text-gray-100 transition-colors duration-300 disabled:opacity-50"
      :class="{ 'rounded-l-xl': currentPage <= 1 }"
      type="button"
      @click="onPrevPage"
    >
      Previous
    </button>
    <span class="px-4 py-2 border border-gray-700 cursor-default">
      Page <strong>{{ currentPage }}</strong> of {{ totalPages }}
    </span>
    <button
      :disabled="currentPage === totalPages"
      class="px-4 py-2 border border-gray-700 enabled:hover:bg-myViolet enabled:hover:text-gray-100 transition-colors duration-300 disabled:opacity-50"
      :class="{ 'rounded-r-xl': currentPage === totalPages }"
      type="button"
      @click="onNextPage"
    >
      Next
    </button>
    <button
      v-if="currentPage !== totalPages"
      class="px-4 py-2 border border-gray-700 rounded-r-xl hover:bg-myViolet hover:text-gray-100 transition-colors duration-300"
      type="button"
      @click="onLastPage"
    >
      <i class="fa-solid fa-angles-right"></i>
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  onFirstPage: Function,
  onLastPage: Function,
  onPrevPage: Function,
  onNextPage: Function,
  currentPage: Number,
  totalPages: Number,
});
</script>
