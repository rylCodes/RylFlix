<template>
  <div role="status" class="flex gap-4 animate-pulse">
    <div
      class="absolute w-full h-fit -z-10 opacity-15 aspect-[2/3] lg:static lg:w-56 lg:h-fit lg:opacity-100 bg-contain lg:flex lg:items-center lg:justify-center bg-gray-700"
    >
      <svg
        class="w-32 h-32 opacity-50 text-gray-200 dark:text-gray-600 mx-auto mt-36 lg:w-10 lg:h-10 lg:mt-0 lg:opacity-100"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 18"
      >
        <path
          d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"
        />
      </svg>
    </div>
    <div
      class="flex-1 flex flex-col w-full gap-4 text-sm px-4 py-6 mt-16 lg:mt-0 md:mt-56"
    >
      <div class="h-6 rounded-full bg-gray-700 w-48"></div>
      <div class="h-2.5 rounded-full bg-gray-700 w-36"></div>
      <div>
        <div class="h-2 rounded-full bg-gray-700 max-w-[480px] mb-2.5"></div>
        <div class="h-2 rounded-full bg-gray-700 max-w-[520px] mb-2.5"></div>
        <div class="h-2 rounded-full bg-gray-700 max-w-[440px] mb-2.5"></div>
        <div class="h-2 rounded-full bg-gray-700 max-w-[460px] mb-2.5"></div>
        <div class="h-2 rounded-full bg-gray-700 max-w-[360px]"></div>
      </div>
      <div class="flex gap-4">
        <div>
          <div
            class="h-2 rounded-full bg-gray-700 w-12 max-w-[480px] mb-2.5"
          ></div>
          <div class="h-2 rounded-full bg-gray-700 w-10 mb-2.5"></div>
          <div
            class="h-2 rounded-full bg-gray-700 w-14 max-w-[440px] mb-2.5"
          ></div>
          <div
            class="h-2 rounded-full bg-gray-700 w-10 max-w-[460px] mb-2.5"
          ></div>
          <div
            class="h-2 rounded-full bg-gray-700 w-10 max-w-[460px] mb-2.5"
          ></div>
          <div
            class="h-2 rounded-full bg-gray-700 w-12 max-w-[460px] mb-2.5"
          ></div>
          <div class="h-2 rounded-full bg-gray-700 w-14 max-w-[360px]"></div>
        </div>
        <div>
          <div
            class="h-2 rounded-full bg-gray-700 w-32 max-w-[480px] mb-2.5"
          ></div>
          <div class="h-2 rounded-full bg-gray-700 w-44 mb-2.5"></div>
          <div
            class="h-2 rounded-full bg-gray-700 w-48 max-w-[440px] mb-2.5"
          ></div>
          <div
            class="h-2 rounded-full bg-gray-700 w-44 max-w-[460px] mb-2.5"
          ></div>
          <div
            class="h-2 rounded-full bg-gray-700 w-32 max-w-[460px] mb-2.5"
          ></div>
          <div
            class="h-2 rounded-full bg-gray-700 w-48 max-w-[460px] mb-2.5"
          ></div>
          <div class="h-2 rounded-full bg-gray-700 w-44 max-w-[360px]"></div>
        </div>
      </div>
    </div>
    <span class="sr-only">Loading...</span>
  </div>
</template>
