<template>
  <div class="container cstm-min-h mx-auto flex items-center justify-center">
    <div class="flex flex-col w-full max-w-xl h-auto">
      <img
        class="w-full h-auto"
        src="../assets/404-Error-broken-robot.svg"
        alt=""
      />
      <RouterLink
        class="w-fit mx-auto text-violet-500 border border-violet-500 px-2 py-1 rounded-lg hover:opacity-75 transition-all duration-300"
        :to="'/'"
        >Back to Home Page</RouterLink
      >
    </div>
  </div>
</template>
