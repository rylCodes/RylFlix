<template>
  <div class="bg-gray-950 text-gray-400">
    <HeaderComponent />
    <div ref="main" class="w-full h-full cstm-min-h">
      <router-view />
    </div>
    <FooterComponent />
  </div>
</template>

<script setup>
import FooterComponent from "./components/FooterComponent.vue";
import HeaderComponent from "./components/HeaderComponent.vue";
</script>

<style>
.cstm-min-h {
  min-height: calc(90vh - 4rem);
  min-height: calc(90svh - 4rem);
}
</style>
