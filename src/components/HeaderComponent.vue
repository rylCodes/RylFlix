<template>
  <header ref="headerElement" class="min-h-16 bg-header-img px-4">
    <div class="flex justify-between items-center py-1.5">
      <!-- Logo -->
      <RouterLink to="/">
        <div class="flex items-center px-1 gap-1">
          <img class="w-6 h-auto" src="../assets/logo.png" alt="" />
          <h1 class="text-2xl text-gray-100 font-extrabold drop-shadow-lg">
            <span class="text-violet-500">Ryl</span>Flix
          </h1>
        </div>
      </RouterLink>
      <div class="relative">
        <!-- ICONS: Search, Profile, Menu -->
        <ul class="relative flex items-center gap-4">
          <!-- Search Icon -->
          <li v-if="$route.fullPath !== '/'">
            <a
              class="leading-none text-gray-100 cursor-pointer hover:text-violet-500 transition-colors duration-300"
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
              ref="userMenu"
              @click="toggleUserMenu()"
              class="text-lg md:text-xl text-gray-100 cursor-pointer hover:text-violet-500 transition-colors duration-300"
            >
              <i class="fa-solid fa-user-large"></i>
            </a>
            <transition name="fade">
              <div
                v-if="isUserMenuOpen"
                class="absolute top-full right-0 px-4 py-3 z-30 flex flex-col gap-2 text-sm text-gray-400 bg-gray-800 font-medium w-64 rounded-2xl overflow-hidden sm:text-base"
              >
                <div v-if="isAuthenticated" class="flex items-center gap-1.5">
                  <div
                    class="flex items-center justify-center rounded-full bg-violet-500 text-gray-100 size-7 uppercase"
                    alt=""
                  >
                    <span>{{ username && username[0] }}</span>
                  </div>
                  <span>
                    {{ username }}
                  </span>
                </div>

                <div v-if="!isAuthenticated" class="flex gap-1.5 items-center">
                  <span class="text-2xl"
                    ><i class="mdi mdi-account-circle"></i
                  ></span>
                  <span
                    class="rounded-t-2xl text-start transition-colors duration-500"
                  >
                    Guest
                  </span>
                </div>

                <ul v-if="isAuthenticated" class="flex flex-col">
                  <li class="px-2 py-1" v-if="isAuthenticated">
                    <RouterLink
                      :to="{
                        name: 'WatchList',
                        params: { user: username && username },
                      }"
                      class="cursor-pointer flex items-center gap-2 rounded-b-2xl hover:text-violet-500 text-start transition-colors duration-500"
                    >
                      <i
                        class="mdi mdi-playlist-play leading-none scale-125"
                      ></i>
                      <span>Watchlist</span>
                    </RouterLink>
                  </li>
                  <li class="px-2 py-1" v-if="isAuthenticated">
                    <RouterLink
                      :to="{
                        name: 'Favorite',
                        params: { user: username && username },
                      }"
                      class="cursor-pointer flex items-center gap-2 rounded-b-2xl hover:text-violet-500 text-start transition-colors duration-500"
                    >
                      <i class="mdi mdi-heart leading-none scale-110"></i>
                      <span>Favorite</span>
                    </RouterLink>
                  </li>
                  <li class="px-2 py-1" v-if="isAuthenticated">
                    <RouterLink
                      :to="{
                        name: 'Ratings',
                        params: { user: username && username },
                      }"
                      class="cursor-pointer flex items-center gap-2 rounded-b-2xl hover:text-violet-500 text-start transition-colors duration-500"
                    >
                      <i class="mdi mdi-star leading-none scale-125"></i>
                      <span>Ratings</span>
                    </RouterLink>
                  </li>
                </ul>

                <hr class="border-gray-500" />

                <RouterLink
                  v-if="!isAuthenticated"
                  :to="{ name: 'Login' }"
                  class="rounded-b-2xl hover:text-violet-500 text-start transition-colors duration-500"
                >
                  <i class="fa-solid fa-right-to-bracket"></i> Login
                </RouterLink>
                <button
                  v-if="isAuthenticated"
                  type="button"
                  @click="logout()"
                  class="rounded-b-2xl hover:text-red-500 text-start transition-colors duration-500"
                >
                  <i class="fa-solid fa-right-from-bracket"></i> Log Out
                </button>
              </div>
            </transition>
            <ModalComponent
              :state="isLoginFormOpen"
              @update:state="isLoginFormOpen = $event"
            >
            </ModalComponent>
          </li>

          <!-- NavBar Icon -->
          <li>
            <a
              ref="navBar"
              class="group text-gray-100 cursor-pointer hover:text-violet-500 transition-colors duration-300"
              @click="toggleNavBar($event)"
            >
              <!-- <i class="mdi mdi-menu-open text-[2.25rem] md:text-[2.5rem]"></i> -->
              <HamburgerMenuComponent :isNavBarOpen="isNavBarOpen" />
              <transition name="fade">
                <nav
                  v-if="isNavBarOpen"
                  class="absolute top-full right-0 z-40 flex flex-col justify-center text-sm text-gray-400 bg-gray-800 font-medium w-64 rounded-2xl overflow-hidden sm:text-base"
                >
                  <RouterLink
                    to="/"
                    class="rounded-t-2xl px-4 py-3 hover:bg-violet-500 hover:text-gray-100 transition-colors duration-500"
                  >
                    Home
                  </RouterLink>
                  <RouterLink
                    to="/movies"
                    class="px-4 py-3 hover:bg-violet-500 hover:text-gray-100 transition-colors duration-500"
                  >
                    Movies
                  </RouterLink>
                  <RouterLink
                    to="/tvshows"
                    class="px-4 py-3 hover:bg-violet-500 hover:text-gray-100 transition-colors duration-500"
                  >
                    TV Shows
                  </RouterLink>
                  <RouterLink
                    to="/about"
                    class="rounded-b-2xl px-4 py-3 hover:bg-violet-500 hover:text-gray-100 transition-colors duration-500"
                  >
                    About
                  </RouterLink>
                </nav>
              </transition>
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
import { ref, onMounted, onBeforeMount, onBeforeUnmount, watch } from "vue";

import useUserAuth from "@/composables/userAuth";

import ModalComponent from "./ModalComponent.vue";
import SearchBarComponent from "@/components/SearchBarComponent.vue";
import HamburgerMenuComponent from "@/components/HamburgerMenuComponent.vue";
import router from "@/router";

const isNavBarOpen = ref(false);
const isLoginFormOpen = ref(false);
const isUserMenuOpen = ref(false);
const isSearchBarOpen = ref(false);
const navBar = ref(null);
const userMenu = ref(null);
const loginForm = ref(null);
const headerElement = ref(null);

const emit = defineEmits(["headerHeight"]);

const { isAuthenticated, username, logout, setIsAuthenticated, setUsername } =
  useUserAuth();

const toggleNavBar = (event) => {
  isNavBarOpen.value = !isNavBarOpen.value;
  isUserMenuOpen.value = false;
};

const toggleSearchBar = () => {
  isSearchBarOpen.value = !isSearchBarOpen.value;
  isNavBarOpen.value = false;
  isUserMenuOpen.value = false;
};

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
  isNavBarOpen.value = false;
};

const toggleLoginForm = () => {
  isLoginFormOpen.value = !isLoginFormOpen.value;
};

const closeNavBar = (event) => {
  if (navBar.value && !navBar.value.contains(event.target)) {
    isNavBarOpen.value = false;
  }
};

const closeUserMenu = (event) => {
  if (userMenu.value && !userMenu.value.contains(event.target)) {
    isUserMenuOpen.value = false;
  }
};

onMounted(async () => {
  emit("headerHeight", headerElement.value.offsetHeight);
  document.addEventListener("click", closeNavBar);
  document.addEventListener("click", closeUserMenu);

  if (localStorage.getItem("request_token")) {
    setIsAuthenticated(true);
    setUsername(JSON.parse(localStorage.getItem("currentUser")));
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeNavBar);
  document.removeEventListener("click", closeUserMenu);
});

watch(
  () => localStorage.getItem("request_token"),
  () => setIsAuthenticated(true)
);

watch(
  () => isAuthenticated.value,
  (newState) => (!newState ? router.push("/") : null)
);
</script>

<style scoped>
.bg-header-img {
  background-image: url("../assets/header-image.jpg");
  background-size: cover;
  background-position: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
