<template>
  <div class="relative overflow-hidden">
    <!-- Background -->
    <div
      class="absolute top-0 left-0 w-full h-full bg-[url('../assets/marvel_grid.jpg')] grayscale bg-cover bg-top"
    >
      <div class="w-full h-full vignette"></div>
    </div>
    <div
      class="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-gray-950 bg-[rgba(3,7,18,0.1)]"
    ></div>

    <!-- Main -->
    <main
      class="flex items-center justify-center w-full h-full cstm-min-h px-4"
    >
      <form
        @submit.prevent="onLogin()"
        class="z-50 px-10 py-8 bg-gray-900 h-auto w-full max-w-4xl rounded-2xl text-gray-100"
      >
        <h1 class="text-3xl text-center font-medium">Login to your account</h1>
        <p class="mt-8">
          RylFlix uses the TMDB API for editing, rating, and personal
          recommendations. To log in to RylFlix and access these features, use
          your TMDB account. If you don't have one, you can register for free.
          <a
            @click.prevent="popUpNewWindow('https://www.themoviedb.org/signup')"
            class="text-violet-500 cursor-pointer"
            >here</a
          >.
        </p>
        <p class="mt-4">
          If you need to resend your verification email, click
          <a
            @click.prevent="
              popUpNewWindow(
                'https://www.themoviedb.org/resend-email-verification'
              )
            "
            class="text-violet-500 cursor-pointer"
            >here</a
          >.
        </p>

        <input
          v-model="usernameInput"
          id="username"
          class="w-full px-4 py-2 bg-gray-950 rounded-xl mt-8 placeholder:text-gray-600 outline-none focus:outline focus:outline-violet-500"
          type="text"
          placeholder="Enter username"
        />

        <input
          v-model="passwordInput"
          id="password"
          class="w-full px-4 py-2 bg-gray-950 rounded-xl mt-2 placeholder:text-gray-600 outline-none focus:outline focus:outline-violet-500"
          type="password"
          placeholder="Enter password"
        />

        <div class="text-center text-sm text-gray-500 mt-10">
          <a
            @click.prevent="
              popUpNewWindow('https://www.themoviedb.org/reset-password')
            "
            class="hover:text-violet-500 text-gray-100 transition-colors duration-300 cursor-pointer"
            >Reset password</a
          >
        </div>

        <button
          v-if="!isAuthenticated"
          type="submit"
          class="w-full py-2 text-center rounded-xl bg-violet-500 mt-4 text-gray-900 font-semibold text-sm hover:bg-violet-600 transition-colors duration-300"
        >
          Login
          <i class="fa-solid fa-circle-chevron-right text-xs"></i>
        </button>

        <div class="text-center text-sm text-gray-500 mt-3">
          <span>Not a member? </span
          ><a
            @click.prevent="popUpNewWindow('https://www.themoviedb.org/signup')"
            class="hover:text-violet-500 text-gray-100 transition-colors duration-300 cursor-pointer"
            >Sign Up Now</a
          >
        </div>
      </form>
    </main>
    <LoaderModalComponentVue v-if="isLoggingIn" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import useUserAuth from "../composables/userAuth";
import LoaderModalComponentVue from "@/components/LoaderModalComponent.vue";

const { isAuthenticated, login } = useUserAuth();

const usernameInput = ref("");
const passwordInput = ref("");
const isLoggingIn = ref(false);

const router = useRouter();

const onLogin = async () => {
  isLoggingIn.value = true;
  const loginForm = {
    username: usernameInput.value,
    password: passwordInput.value,
  };

  if (loginForm.username.trim() === "" || loginForm.password.trim() === "") {
    alert("Username and password are required!");
    return;
  }

  await login(loginForm);

  isLoggingIn.value = false;
  router.push("/");
};

const popUpNewWindow = (url) => {
  const width = 600;
  const height = 600;

  const left = screen.width / 2 - width / 2;
  const top = screen.height / 2 - height / 2;
  window.open(
    url,
    "popup",
    `width=${width},height=${height},top=${top},left=${left}`
  );
};
</script>
