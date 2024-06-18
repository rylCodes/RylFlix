<template>
  <footer ref="footerElement" class="p-4">
    <div
      class="flex flex-col gap-4 w-full border border-gray-800 px-10 py-12 rounded-2xl sm:flex-row"
    >
      <nav class="flex text-xl font-semibold w-full sm:w-1/2">
        <div class="flex flex-col w-full sm:w-1/3">
          <router-link
            class="hover:text-violet-500 transition-colors duration-300"
            to="/filter/a-z/"
            >A-Z List</router-link
          >
          <a
            class="hover:text-violet-500 transition-colors duration-300"
            href="#"
            >New Release</a
          >
          <a
            class="hover:text-violet-500 transition-colors duration-300"
            href="#"
            >Recently Added</a
          >
          <a
            class="hover:text-violet-500 transition-colors duration-300"
            href="#"
            >Most Watched</a
          >
        </div>
        <div class="flex flex-col w-full sm:w-2/3">
          <a
            class="hover:text-violet-500 transition-colors duration-300"
            href="#"
            >Contact</a
          >
        </div>
      </nav>
      <div class=""></div>
      <div class="flex-1">
        <!-- Logo -->
        <router-link to="/">
          <div class="flex justify-end items-center gap-1">
            <img class="w-6 h-auto" src="../assets/logo.png" alt="" />
            <h1 class="text-2xl text-gray-100 font-extrabold drop-shadow-lg">
              <span class="text-violet-500">Ryl</span>Flix
            </h1>
          </div>
        </router-link>
        <p class="text-end text-sm font-semibold">
          Check out RylFlix for free movie streaming! Watch a huge collection of
          movies online for free. Enjoy the magic of cinema right from home.
          Ready, set, watch!"
        </p>
      </div>
    </div>
    <div class="w-fit mx-auto mt-4 text-center">
      <small
        >This website does not host any files on our server; we simply provide
        links to media stored on third-party services.</small
      >
    </div>
  </footer>
</template>

<script setup>
import { onMounted, ref } from "vue";

const emit = defineEmits(["footerHeight"]);

const footerElement = ref(null);
onMounted(() => {
  emit("footerHeight", footerElement.value.offsetHeight);
});
</script>
