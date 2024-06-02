<template>
  <HeaderComponent />
  <router-view />
  <FooterComponent />
</template>

<script setup>
import FooterComponent from "./components/FooterComponent.vue";
import HeaderComponent from "./components/HeaderComponent.vue";
import useMovies from "./composables/movies";

const { isFetchingMovies } = useMovies();
</script>
