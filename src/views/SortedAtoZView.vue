<template>
  <div class="flex flex-col w-full p-6 mb-10 gap-12 lg:flex-row lg:gap-4">
    <main class="flex-1">
      <h3 class="font-semibold text-2xl text-gray-100">A-Z List</h3>
      <!-- Filter Search -->
      <FiltersComponent
        v-model="searchInput"
        :onSubmit="onSearchingOmdb"
        :isMovieTypeSelected="isMovieTypeSelected"
        :isTvTypeSelected="isTvTypeSelected"
        :setIsMovieTypeSelected="setIsMovieTypeSelected"
        :setIsTvTypeSelected="setIsTvTypeSelected"
      />

      <!-- Search Results -->
      <SortedAtoZComponent
        :allSortedShows="sortedAllAtoZ"
        v-if="!isFilterFetching && sortedAllAtoZ.length > 0"
      />

      <SkeletonComponent v-if="isFilterFetching" />

      <PaginationComponent
        :onPrevPage="onPrevPage"
        :onNextPage="onNextPage"
        :onFirstPage="onFirstPage"
        :onLastPage="onLastPage"
        :currentPage="currentPage"
        :totalPages="totalPages"
      />
    </main>

    <aside class="w-full lg:w-64">
      <h3 class="font-semibold text-2xl text-gray-100">SUGGESTIONS</h3>
      <!-- Top Rated Movies -->
      <div class="mt-4">
        <div
          class="grid grid-cols-1 gap-2 lg:grid-cols-1 md:grid-cols-3 sm:grid-cols-2"
        >
          <div
            v-for="trending in allTrending"
            :key="trending.id"
            class="flex items-center gap-2 w-full border border-gray-800 p-2 rounded-lg hover:bg-gray-900 transition-all duration-300"
          >
            <div class="w-10">
              <router-link
                :to="{
                  name: 'ShowMovie' || 'ShowTVShow',
                  params: {
                    id: trending.id,
                    title: trending.name
                      ? toKebabCase(trending.name)
                      : toKebabCase(trending.title),
                  },
                }"
              >
                <img
                  v-if="trending.poster_path"
                  class="rounded-md"
                  :src="
                    'https://image.tmdb.org/t/p/w200' + trending.poster_path
                  "
                  alt=""
                />
              </router-link>
            </div>
            <div class="flex-1">
              <router-link
                :to="{
                  name: 'ShowMovie' || 'ShowTVShow',
                  params: {
                    id: trending.id,
                    title: trending.name
                      ? toKebabCase(trending.name)
                      : toKebabCase(trending.title),
                  },
                }"
              >
                <h6 class="font-semibold text-gray-100">
                  {{ trending.title || trending.name }}
                </h6>
                <div class="flex items-center gap-2 text-sm">
                  <div class="flex items-center gap-1 text-yellow-500">
                    <i class="fa-solid fa-star text-xs"></i>
                    <span>{{
                      trending.vote_average
                        ? toOneDecimal(trending.vote_average)
                        : "--"
                    }}</span>
                  </div>
                  <span>•</span>
                  <span>{{
                    trending.release_date
                      ? trending.release_date.split("-")[0]
                      : trending.first_air_date.split("-")[0]
                  }}</span>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
// Components
import FiltersComponent from "../components/FiltersComponent.vue";
import SortedAtoZComponent from "../components/SortedAtoZComponent.vue";
import PaginationComponent from "../components/PaginationComponent.vue";
import SkeletonComponent from "../components/SkeletonComponent.vue";

// Composables
import useFilterAll from "../composables/filter";
import useAllTrending from "../composables/all";

import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { toKebabCase, toOneDecimal } from "../utils/textFormatter";
import useFilterService from "@/services/filterService";

const {
  sortedAllAtoZ,
  isFilterFetching,
  prevPage,
  nextPage,
  currentPage,
  totalPages,
  setSortedAllAtoZ,
} = useFilterAll();

const { allTrending, showAllTrending } = useAllTrending();

const {
  isMovieTypeSelected,
  isTvTypeSelected,
  setIsMovieTypeSelected,
  setIsTvTypeSelected,
} = useFilterService();

const route = useRoute();
const router = useRouter();
const searchBarInput = ref(route.query.search);
const searchInput = ref("");

const type = ref(null);
const year = ref(null);
const page = ref(null);

const onSearchingOmdb = () => {
  if (searchInput.value.trim() !== "") {
    router.push({
      name: "Filter",
      query: {
        search: searchInput.value,
      },
    });

    setSearchResults(searchInput.value, type.value, year.value, page.value);
  }
};

const onPrevPage = () => {
  if (prevPage.value !== null) {
    setSortedAllAtoZ(prevPage.value);
  }
};

const onNextPage = () => {
  if (nextPage.value !== null) {
    setSortedAllAtoZ(nextPage.value);
  }
};

const onFirstPage = () => {
  setSortedAllAtoZ();
};

const onLastPage = () => {
  setSortedAllAtoZ(totalPages.value);
};

watch(currentPage, (newPage) => {
  router.push({
    name: route.name,
    query: {
      page: newPage,
    },
  });
});

onMounted(async () => {
  await setSortedAllAtoZ(route.query.page);
  showAllTrending(9);
});
</script>
