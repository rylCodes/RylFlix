<template>
  <div
    class="relative px-7 py-8 bg-gray-900 h-auto w-[26rem] rounded-2xl text-gray-100"
  >
    <button
      type="button"
      class="text-3xl text-gray-600 absolute top-3 right-3 hover:text-purple-400 transition-all duration-300"
      @click="toggleSignInForm()"
    >
      <i class="mdi mdi-close-circle"></i>
    </button>
    <h1 class="text-3xl text-center font-medium">
      SIGN <span class="text-purple-400">IN</span>
    </h1>
    <input
      class="w-full px-4 py-2 bg-gray-950 rounded-xl mt-6 placeholder:text-gray-600"
      type="text"
      placeholder="Enter username or email"
    />

    <input
      class="w-full px-4 py-2 bg-gray-950 rounded-xl mt-2 placeholder:text-gray-600"
      type="password"
      placeholder="Enter password"
    />

    <div class="text-center text-sm text-gray-500 mt-6">
      <a
        href=""
        class="hover:text-purple-400 text-gray-100 transition-colors duration-300"
        >Forgot password</a
      >
    </div>

    <button
      type="submit"
      class="w-full py-2 text-center rounded-xl bg-purple-400 mt-3 text-gray-900 font-semibold text-sm hover:bg-purple-300 transition-colors duration-300"
    >
      Login <i class="fa-solid fa-circle-chevron-right text-xs"></i>
    </button>

    <div class="text-center text-sm text-gray-500 mt-3">
      <span>Not a member? </span
      ><a
        href=""
        class="hover:text-purple-400 text-gray-100 transition-colors duration-300"
        >Sign Up Now</a
      >
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  toggleSignInForm: Function,
});
</script>
