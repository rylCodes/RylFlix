<template>
  <div class="flex flex-col w-full p-6 mb-10 gap-12 lg:flex-row lg:gap-4">
    <main class="flex-1">
      <div class="flex items-center gap-4">
        <h3 class="font-semibold text-2xl text-gray-100">WATCHLIST</h3>
        <!-- BUTTONS: Watch list Options -->
        <div class="flex items-center gap-1 text-sm">
          <button
            data-watchlist="movieList"
            ref="movieList"
            class="px-2.5 py-1 rounded-md bg-gray-800 hover:bg-violet-500 hover:text-gray-100 transition-colors duration-300"
            :class="{
              'bg-violet-500 text-gray-100': selectedWatchList === 'movieList',
            }"
            @click="onSelectWatchList($event)"
          >
            Movies
          </button>
          <button
            data-watchlist="tvShowsList"
            ref="tvShowsList"
            class="px-2.5 py-1 rounded-md bg-gray-800 hover:bg-violet-500 hover:text-gray-100 transition-colors duration-300"
            :class="{
              'bg-violet-500 text-gray-100':
                selectedWatchList === 'tvShowsList',
            }"
            @click="onSelectWatchList($event)"
          >
            TV Shows
          </button>
        </div>
      </div>

      <!-- Movie Watch List -->
      <div
        class="flex flex-col gap-2 w-full mt-4"
        v-if="selectedWatchList === 'movieList'"
      >
        <div v-for="movie in movieWatchList" :key="movie.id">
          <div
            class="relative flex flex-col border border-gray-700 rounded-2xl overflow-hidden flex-1"
          >
            <div
              class="absolute top-0 right-1/2 translate-x-1/2 lg:right-0 lg:translate-x-0"
            >
              <StarRatingComponent
                v-if="movie.vote_average || 'N/A'"
                :rating="movie.vote_average ? movie.vote_average : 'N/A'"
                :reviews="movie.vote_count ? movie.vote_count : 'N/A'"
              />
            </div>

            <!-- Skeleton Movie Details -->
            <DetailSkeleton v-if="isFetching" />

            <div class="flex gap-4" v-if="!isFetching">
              <div
                class="absolute w-full h-fit opacity-15 aspect-[2/3] lg:static lg:w-56 lg:h-fit lg:opacity-100 bg-contain"
                :style="{
                  'background-image':
                    'url(https://image.tmdb.org/t/p/w45' +
                    movie.poster_path +
                    ')',
                }"
              >
                <img
                  :class="isImageLoaded ? 'opacity-100' : 'opacity-0'"
                  class="aspect-[2/3] w-full h-auto rounded-xl"
                  :src="'https://image.tmdb.org/t/p/w300' + movie.poster_path"
                  loading="lazy"
                  @load="onImageLoad()"
                  alt=""
                />
              </div>
              <div
                class="flex-1 flex flex-col w-full gap-2 text-sm px-4 py-6 mt-16 lg:mt-0 md:mt-56"
              >
                <h4
                  v-if="movie.title"
                  class="text-2xl text-slate-100 max-w-full font-semibold xl:max-w-lg lg:max-w-xs sm:text-3xl"
                >
                  {{ movie.title }}
                </h4>
                <p>{{ movie.overview }}</p>
                <div>
                  <div class="flex items-center w-full capitalize">
                    <span class="w-24">Type:</span>
                    <span class="flex-1 text-gray-300">{{ "Movie" }}</span>
                  </div>
                  <div class="flex items-center w-full capitalize">
                    <span class="w-24">Release:</span>
                    <span class="flex-1 text-gray-300">
                      {{
                        movie.release_date &&
                        formatDateToLong(movie.release_date)
                      }}
                    </span>
                  </div>
                </div>

                <!-- Options -->
                <div class="mt-auto flex items-center gap-4">
                  <div class="group flex items-center gap-2 cursor-pointer">
                    <span
                      class="flex items-center justify-center size-8 p-1 rounded-full border border-gray-400 group-hover:bg-gray-400 transition-all duration-300"
                      ><i
                        class="fa-solid fa-star group-hover:text-gray-900 transition-all duration-300"
                      ></i></span
                    ><span class="text-base">Rate it!</span>
                  </div>
                  <div class="group flex items-center gap-2 cursor-pointer">
                    <span
                      class="flex items-center justify-center size-8 p-1 rounded-full border border-gray-400 group-hover:bg-gray-400 transition-all duration-300"
                      ><i
                        class="fa-solid fa-heart group-hover:text-gray-900 transition-all duration-300"
                      ></i></span
                    ><span class="text-base">Favorite</span>
                  </div>
                  <div class="group flex items-center gap-2 cursor-pointer">
                    <span
                      class="flex items-center justify-center size-8 p-1 rounded-full border border-gray-400 group-hover:bg-gray-400 transition-all duration-300"
                      ><i
                        class="fa-solid fa-list group-hover:text-gray-900 transition-all duration-300"
                      ></i></span
                    ><span class="text-base">Add to list</span>
                  </div>
                  <div class="group flex items-center gap-2 cursor-pointer">
                    <span
                      class="flex items-center justify-center size-8 p-1 rounded-full border border-gray-400 group-hover:bg-gray-400 transition-all duration-300"
                      ><i
                        class="fa-solid fa-xmark group-hover:text-gray-900 transition-all duration-300"
                      ></i></span
                    ><span class="text-base">Remove</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TV Show Watch List -->
      <div
        v-if="selectedWatchList === 'tvShowsList'"
        class="flex flex-col gap-2 w-full mt-4"
      >
        TV Show Watch List
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, toRef, ref } from "vue";

// Components
import AllMoviesComponent from "../components/AllMoviesComponent.vue";
import AllTVShowsComponent from "../components/AllTVShowsComponent.vue";
import StarRatingComponent from "../components/StarRatingComponent.vue";
import DetailSkeleton from "../components/DetailSkeleton.vue";

import useWatchList from "../composables/watchList";

import { toKebabCase, toOneDecimal } from "../utils/textFormatter";
import { formatDateToLong } from "../utils/dateFormatter";

const isImageLoaded = ref(false);

const onImageLoad = () => {
  isImageLoaded.value = true;
};

const { getMovieWatchList, movieWatchList, isFetching } = useWatchList();

const selectedWatchList = ref("movieList");

const onSelectWatchList = (event) => {
  selectedWatchList.value = event.target.getAttribute("data-watchlist");
};

onMounted(() => {
  getMovieWatchList();
});
</script>

<style scoped>
.item-enter-active,
.item-leave-active {
  transition: all 0.5s ease;
}
.item-enter-from,
.item-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
