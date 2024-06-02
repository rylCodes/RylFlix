<template>
  <div class="mt-4">
    <form @submit.prevent="onSubmit()" class="flex w-full gap-1 lg:w-1/2">
      <input
        v-model="innerValue"
        type="text"
        class="w-1/3 rounded-lg px-4 py-1 bg-gray-800 text-sm text-gray-300 placeholder:text-gray-500 focus:outline-none"
        placeholder="Search..."
      />
      <!-- Type Option -->
      <div ref="typeOption" class="relative w-1/3">
        <button
          type="button"
          @click="toggleFilterType()"
          class="flex items-center w-full h-full justify-between rounded-lg px-4 py-1 bg-gray-800 hover:bg-purple-400 hover:text-gray-900 transition-colors duration-300 focus:outline-none"
          :class="isTypeOptionOpen && 'bg-purple-400 text-gray-900'"
        >
          <span class="text-sm font-semibold">{{ selectedType }}</span>
          <i
            class="fa-solid fa-circle-chevron-down text-xs rotate-0 transition-transform duration-300"
            :class="isTypeOptionOpen && 'rotate-180'"
          ></i>
        </button>
        <div
          :class="isTypeOptionOpen ? 'h-14' : 'h-0'"
          class="absolute top-[125%] left-0 flex flex-col justify-center gap-1 z-50 bg-gray-800 w-full min-w-fit text-sm rounded-lg overflow-hidden transition-all durantion-300"
        >
          <SelectValueComponent
            @click="props.setIsMovieTypeSelected()"
            :isSelected="props.isMovieTypeSelected"
            :option="'Movie'"
          />
          <SelectValueComponent
            @click="props.setIsTvTypeSelected()"
            :isSelected="props.isTvTypeSelected"
            :option="'TV'"
          />
        </div>
      </div>
      <!-- <button
        type="button"
        class="flex items-center w-full h-full justify-between rounded-lg px-4 py-1 bg-gray-800 hover:bg-purple-400 hover:text-gray-900 transition-colors duration-300 focus:outline-none"
      >
        <span class="text-sm font-semibold">Genre</span>
        <i class="fa-solid fa-circle-chevron-down text-xs"></i>
      </button>
      <button
        type="button"
        class="flex items-center w-full h-full justify-between rounded-lg px-4 py-1 bg-gray-800 hover:bg-purple-400 hover:text-gray-900 transition-colors duration-300 focus:outline-none"
      >
        <span class="text-sm font-semibold">Country</span>
        <i class="fa-solid fa-circle-chevron-down text-xs"></i>
      </button>
      <button
        type="button"
        class="flex items-center w-full h-full justify-between rounded-lg px-4 py-1 bg-gray-800 hover:bg-purple-400 hover:text-gray-900 transition-colors duration-300 focus:outline-none"
      >
        <span class="text-sm font-semibold">Year</span>
        <i class="fa-solid fa-circle-chevron-down text-xs"></i>
      </button>
      <button
        type="button"
        class="flex items-center w-full h-full justify-between rounded-lg px-4 py-1 bg-gray-800 hover:bg-purple-400 hover:text-gray-900 transition-colors duration-300 focus:outline-none"
      >
        <span class="text-sm font-semibold">Rating</span>
        <i class="fa-solid fa-circle-chevron-down text-xs"></i>
      </button>
      <button
        type="button"
        class="flex items-center w-full h-full justify-between rounded-lg px-4 py-1 bg-gray-800 hover:bg-purple-400 hover:text-gray-900 transition-colors duration-300 focus:outline-none"
      >
        <span class="text-sm font-semibold">Quality</span>
        <i class="fa-solid fa-circle-chevron-down text-xs"></i>
      </button> -->
      <button
        @click="onSubmit()"
        :disabled="props.modelValue.trim() === ''"
        type="button"
        class="flex-1 text-center rounded-lg px-4 py-1 bg-purple-400 enabled:hover:bg-purple-300 transition-colors duration-300 text-gray-900 disabled:opacity-50"
      >
        <span class="text-sm font-semibold"
          ><i class="mdi mdi-atom-variant"></i> Filter</span
        >
      </button>
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, onBeforeUnmount } from "vue";
import SelectValueComponent from "./SelectValueComponent.vue";

const props = defineProps({
  onSubmit: Function,
  modelValue: String,
  isMovieTypeSelected: Boolean,
  isTvTypeSelected: Boolean,
  setIsMovieTypeSelected: Function,
  setIsTvTypeSelected: Function,
});

const innerValue = ref(props.modelValue);
const emit = defineEmits(["update:modelValue"]);

const isTypeOptionOpen = ref(false);
const typeOption = ref(null);

const toggleFilterType = () => {
  isTypeOptionOpen.value = !isTypeOptionOpen.value;
};

const selectedType = ref(null);

const showSelectedType = () => {
  if (props.isMovieTypeSelected && !props.isTvTypeSelected) {
    selectedType.value = "Movie";
  } else if (props.isTvTypeSelected && !props.isMovieTypeSelected) {
    selectedType.value = "TV";
  } else {
    selectedType.value = "All";
  }
};

const closeDropDownOptions = (event) => {
  if (typeOption.value && !typeOption.value.contains(event.target)) {
    isTypeOptionOpen.value = false;
  }
};

watch(
  () => props.modelValue,
  (newValue) => {
    innerValue.value = newValue;
  }
);

watch(
  () => innerValue.value,
  (newValue) => {
    emit("update:modelValue", newValue);
  }
);

watch(
  () => props.isMovieTypeSelected,
  (newValue) => {
    showSelectedType();
  }
);

watch(
  () => props.isTvTypeSelected,
  (newValue) => {
    showSelectedType();
  }
);

onMounted(() => {
  showSelectedType();
  document.addEventListener("click", closeDropDownOptions);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeDropDownOptions);
});
</script>
