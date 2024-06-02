<template>
  <header class="min-h-16 bg-header-img px-4">
    <div class="flex justify-between items-center py-1.5">
      <!-- Logo -->
      <router-link to="/">
        <div class="flex items-center px-1 gap-1">
          <img class="w-5 h-auto sm:w-6" src="../assets/logo.png" alt="" />
          <h1 class="text-xl text-gray-100 font-extrabold sm:text-2xl">
            <span class="text-myViolet">Ryl</span>Flix
          </h1>
        </div>
      </router-link>
      <div class="relative">
        <!-- ICONS: Search, Profile, Menu -->
        <ul class="flex items-center gap-4">
          <!-- Search Icon -->
          <li v-if="$route.fullPath !== '/'">
            <a
              class="leading-none text-gray-100 cursor-pointer hover:text-myViolet transition-colors duration-300"
              @click="toggleSearchBar()"
            >
              <i
                class="mdi mdi-movie-search text-[1.625rem] md:text-[1.75rem]"
              ></i>
            </a>
          </li>
          <!-- User Icon -->
          <li>
            <a
              @click="toggleSignInForm()"
              class="text-lg md:text-xl text-gray-100 cursor-pointer hover:text-myViolet transition-colors duration-300"
            >
              <i class="fa-solid fa-user"></i>
            </a>
            <ModalComponent
              :state="isLoginFormOpen"
              @update:state="isLoginFormOpen = $event"
            >
              <SignInComponent :toggleSignInForm="toggleSignInForm" />
            </ModalComponent>
          </li>
          <!-- NavBar Icon -->
          <li>
            <a
              ref="navBar"
              class="group text-gray-100 cursor-pointer hover:text-myViolet transition-colors duration-300"
              @click="toggleNavBar($event)"
            >
              <i class="mdi mdi-menu-open text-[2.25rem] md:text-[2.5rem]"></i>
              <nav
                class="absolute top-full right-0 z-50 flex flex-col justify-center text-sm text-gray-400 bg-gray-800 font-medium w-64 rounded-2xl overflow-hidden sm:text-base transition-all duration-300"
                :class="isNavBarOpen ? 'h-44 lg:h-48' : 'h-0'"
              >
                <router-link
                  to="/"
                  class="rounded-t-2xl px-4 py-3 hover:bg-myViolet hover:text-gray-100 transition-colors duration-500"
                >
                  Home
                </router-link>
                <router-link
                  to="/movies"
                  class="px-4 py-3 hover:bg-myViolet hover:text-gray-100 transition-colors duration-500"
                >
                  Movies
                </router-link>
                <router-link
                  to="/tvshows"
                  class="px-4 py-3 hover:bg-myViolet hover:text-gray-100 transition-colors duration-500"
                >
                  TV Shows
                </router-link>
                <router-link
                  to="/about"
                  class="rounded-b-2xl px-4 py-3 hover:bg-myViolet hover:text-gray-100 transition-colors duration-500"
                >
                  About
                </router-link>
              </nav>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Search Bar -->
    <SearchBarComponent :isSearchBarOpen="isSearchBarOpen" />
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, onBeforeUnmount } from "vue";
import ModalComponent from "./ModalComponent.vue";
import SignInComponent from "./SignInComponent.vue";
import useAllTrending from "@/composables/all";
import SearchBarComponent from "@/components/SearchBarComponent.vue";

const isNavBarOpen = ref(false);
const isLoginFormOpen = ref(false);
const isSearchBarOpen = ref(false);
const navBar = ref(null);
const loginForm = ref(null);

const toggleNavBar = (event) => {
  isNavBarOpen.value = !isNavBarOpen.value;
};

const toggleSearchBar = () => {
  isSearchBarOpen.value = !isSearchBarOpen.value;
};

const toggleSignInForm = () => {
  isLoginFormOpen.value = !isLoginFormOpen.value;
};

const closeNavBar = (event) => {
  if (navBar.value && !navBar.value.contains(event.target)) {
    isNavBarOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeNavBar);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeNavBar);
});
</script>

<style scoped>
.bg-header-img {
  background-image: url("../assets/header-image.jpg");
  background-size: cover;
  background-position: center;
}
</style>
