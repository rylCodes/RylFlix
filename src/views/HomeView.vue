<template>
  <div class="flex flex-col w-full p-6 mb-10 gap-12 lg:flex-row lg:gap-4">
    <main class="flex-1">
      <div class="flex items-center gap-4">
        <h3 class="font-semibold text-2xl text-gray-100">FEATURED</h3>
        <!-- BUTTONS: Featured Type Options -->
        <div class="flex items-center gap-1 text-sm">
          <button
            data-featured="featuredMovies"
            ref="featuredMovies"
            class="px-2.5 py-1 rounded-md bg-gray-800 hover:bg-violet-500 hover:text-gray-100 transition-colors duration-300"
            :class="{
              'bg-violet-500 text-gray-100':
                selectedFeaturedType === 'featuredMovies',
            }"
            @click="onSelectFeaturedType($event)"
          >
            Movies
          </button>
          <button
            data-featured="featuredTVShows"
            ref="featuredTVShows"
            class="px-2.5 py-1 rounded-md bg-gray-800 hover:bg-violet-500 hover:text-gray-100 transition-colors duration-300"
            :class="{
              'bg-violet-500 text-gray-100':
                selectedFeaturedType === 'featuredTVShows',
            }"
            @click="onSelectFeaturedType($event)"
          >
            TV Shows
          </button>
        </div>
      </div>

      <!-- Featured Movies -->
      <AllMoviesComponent
        v-if="selectedFeaturedType === 'featuredMovies'"
        :allMovies="allMovies"
      />

      <!-- Featured TV Shows -->
      <AllTVShowsComponent
        v-if="selectedFeaturedType === 'featuredTVShows'"
        :allTVShows="allTVShows"
      />

      <SkeletonComponent v-if="isFetching" :count="12" />

      <!-- Trending -->
      <div class="mt-12">
        <h3 class="font-semibold text-2xl text-gray-100">TRENDING</h3>
        <ul
          class="grid grid-cols-2 gap-3 mt-4 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3"
        >
          <li v-for="trending in allTrending" :key="trending.id">
            <router-link
              :to="{
                name: trending.media_type === 'tv' ? 'ShowTVShow' : 'ShowMovie',
                params: {
                  id: trending.id,
                  title: toKebabCase(trending.title || trending.name),
                },
              }"
            >
              <div class="card">
                <img
                  class="rounded-lg aspect-[2/3] w-full h-auto"
                  loading="lazy"
                  :src="
                    'https://image.tmdb.org/t/p/w300' + trending.poster_path
                  "
                  alt=""
                />
              </div>
              <h4 class="line-clamp-1 text-center text-gray-100">
                {{ trending.title || trending.name }}
              </h4>
            </router-link>
            <div
              class="flex items-center justify-center text-sm text-center w-full gap-1"
            >
              <span>{{
                trending.release_date
                  ? trending.release_date.split("-")[0]
                  : trending.first_air_date.split("-")[0] || "--"
              }}</span>
              <span>•</span>
              <span class="uppercase">{{ trending.media_type }}</span>
            </div>
          </li>
        </ul>
      </div>

      <SkeletonComponent v-if="isAllTrendingFetching" :count="12" />
    </main>

    <!-- ASIDE: Latest -->
    <aside class="w-full lg:w-64">
      <h3 class="font-semibold text-2xl text-gray-100">LATEST</h3>
      <div class="mt-4">
        <!-- Latest Movies -->
        <TransitionGroup
          name="list"
          tag="ul"
          v-if="selectedFeaturedType === 'featuredMovies'"
          class="grid grid-cols-1 gap-2 lg:grid-cols-1 md:grid-cols-3 sm:grid-cols-2"
        >
          <li
            v-for="(upcomingMovie, index) in upcomingMovies"
            :style="{ transitionDelay: `${index * 100}ms` }"
            :key="upcomingMovie.id"
            class="item-list flex items-center gap-2 w-full border border-gray-800 p-2 rounded-lg hover:bg-gray-900 transition-all duration-300"
          >
            <div class="w-10">
              <router-link
                :to="{
                  name: 'ShowMovie',
                  params: {
                    id: upcomingMovie.id,
                    title: toKebabCase(upcomingMovie.title),
                  },
                }"
              >
                <img
                  class="rounded-md"
                  :src="
                    'https://image.tmdb.org/t/p/w200' +
                    upcomingMovie.poster_path
                  "
                  alt=""
                />
              </router-link>
            </div>
            <div class="flex-1">
              <router-link
                :to="{
                  name: 'ShowMovie',
                  params: {
                    id: upcomingMovie.id,
                    title: toKebabCase(upcomingMovie.title),
                  },
                }"
              >
                <h6 class="font-semibold text-gray-100">
                  {{ upcomingMovie.title }}
                </h6>
                <div class="flex items-center gap-2 text-sm">
                  <div class="flex items-center gap-1 text-yellow-500">
                    <i class="fa-solid fa-star text-xs"></i>
                    <span>{{
                      upcomingMovie.vote_average
                        ? toOneDecimal(upcomingMovie.vote_average)
                        : "--"
                    }}</span>
                  </div>
                  <span>•</span>
                  <span>{{ upcomingMovie.release_date.split("-")[0] }}</span>
                </div>
              </router-link>
            </div>
          </li>
        </TransitionGroup>

        <!-- Latest TV Shows -->
        <TransitionGroup
          name="list"
          tag="ul"
          v-if="selectedFeaturedType === 'featuredTVShows'"
          class="grid grid-cols-1 gap-2 lg:grid-cols-1 md:grid-cols-3 sm:grid-cols-2"
        >
          <li
            v-for="(upcomingTVShow, index) in upcomingTVShows"
            :style="{ transitionDelay: `${index * 100}ms` }"
            :key="upcomingTVShow.id"
            class="item-list flex items-center gap-2 w-full border border-gray-800 p-2 rounded-lg hover:bg-gray-900 transition-all duration-300"
          >
            <div class="w-10">
              <router-link
                :to="{
                  name: 'ShowTVShow',
                  params: {
                    id: upcomingTVShow.id,
                    title: toKebabCase(upcomingTVShow.name),
                  },
                }"
              >
                <img
                  class="rounded-md"
                  :src="
                    'https://image.tmdb.org/t/p/w200' +
                    upcomingTVShow.poster_path
                  "
                  alt=""
                />
              </router-link>
            </div>
            <div class="flex-1">
              <router-link
                :to="{
                  name: 'ShowTVShow',
                  params: {
                    id: upcomingTVShow.id,
                    title: toKebabCase(upcomingTVShow.name),
                  },
                }"
              >
                <h6 class="font-semibold text-gray-100">
                  {{ upcomingTVShow.name }}
                </h6>
                <div class="flex items-center gap-2 text-sm">
                  <div class="flex items-center gap-1 text-yellow-500">
                    <i class="fa-solid fa-star text-xs"></i>
                    <span>{{
                      upcomingTVShow.vote_average
                        ? toOneDecimal(upcomingTVShow.vote_average)
                        : "--"
                    }}</span>
                  </div>
                  <span>•</span>
                  <span>{{ upcomingTVShow.first_air_date.split("-")[0] }}</span>
                </div>
              </router-link>
            </div>
          </li>
        </TransitionGroup>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { onMounted, toRef, ref } from "vue";

// Components
import AllMoviesComponent from "../components/AllMoviesComponent.vue";
import AllTVShowsComponent from "../components/AllTVShowsComponent.vue";
import SkeletonComponent from "../components/SkeletonComponent.vue";

import useMovies from "../composables/movies";
import useTVShows from "../composables/tvshows";
import useAllTrending from "../composables/all";
import { toKebabCase, toOneDecimal } from "../utils/textFormatter";

const { allTVShows, topRatedTVShows, discoverTVShows, showTopRatedTVShows } =
  useTVShows();

const {
  allMovies,
  topRatedMovies,
  isFetching,
  discoverMovies,
  showTopRatedMovies,
} = useMovies();

const {
  allTrending,
  upcomingMovies,
  upcomingTVShows,
  isAllTrendingFetching,
  showAllTrending,
  showUpcomingMovies,
  showUpcomingTVShows,
} = useAllTrending();

const selectedFeaturedType = ref("featuredMovies");

const onSelectFeaturedType = (event) => {
  selectedFeaturedType.value = event.target.getAttribute("data-featured");
};

onMounted(() => {
  discoverMovies(12);
  discoverTVShows(12);
  showAllTrending(12);
  showTopRatedMovies();
  showTopRatedTVShows();
  showUpcomingMovies(12);
  showUpcomingTVShows(12);
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
