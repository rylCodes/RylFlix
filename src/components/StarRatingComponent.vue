<template>
  <div
    class="flex flex-col items-center px-8 py-2 bg-gray-900 rounded-b-xl lg:rounded-bl-3xl lg:rounded-br-none lg:px-4"
  >
    <div
      class="text-[0.8125rem] font-semibold text-center whitespace-nowrap sm:text-sm"
    >
      <strong>{{ props.rating && toOneDecimal(props.rating) }}</strong>
      of <strong>10 </strong
      ><span class="font-thin"
        >({{ props.reviews && props.reviews.toLocaleString() }} reviews)</span
      >
    </div>
    <div class="flex items-center gap-2">
      <div
        class="text-yellow-500 text-xl sm:text-[1.375rem]"
        v-for="(star, index) in stars"
        :key="index"
      >
        <i
          v-if="star.type === 'full'"
          class="inline-block fa-solid fa-star"
        ></i>
        <i
          v-else-if="star.type === 'half'"
          class="inline-block fa-regular fa-star-half-stroke"
        ></i>
        <i v-else class="inline-block fa-regular fa-star"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

import { toOneDecimal } from "@/utils/textFormatter";

const props = defineProps({
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  reviews: {
    type: Number,
    required: true,
    default: 0,
  },
});

const mockData = {
  rating: "4.5",
  reviews: "1,234",
};

const stars = ref(calculateStars(props.rating));
const maxStars = 5;

function calculateStars(rating) {
  const fullStars = Math.floor(rating / 2);
  const halfStars = rating % 2 >= 1 ? 1 : 0;
  const emptyStars = maxStars - fullStars - halfStars;

  return [
    ...Array(fullStars).fill({ type: "full" }),
    ...Array(halfStars).fill({ type: "half" }),
    ...Array(emptyStars).fill({ type: "empty" }),
  ];
}

watch(
  () => props.rating,
  (newRating) => {
    stars.value = calculateStars(newRating);
  }
);
</script>
