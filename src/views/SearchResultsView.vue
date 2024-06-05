<template>
  <div
    class="flex flex-col w-full min-h-svh p-6 mb-10 gap-12 lg:flex-row lg:gap-4"
  >
    <main class="flex-1">
      <h3 class="font-semibold text-2xl text-gray-100">FILTER</h3>
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
      <SearchResultsComponent
        v-if="!isFilterFetching && searchResults.length > 0"
        :searchResults="searchResults"
        :count="10"
      />

      <SkeletonComponent v-if="isFilterFetching" />

      <!-- No Results Fount -->
      <div
        v-if="!isFilterFetching && searchResults.length === 0"
        class="text-center mt-12 lg:mt-24"
      >
        No results found!
      </div>
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
                  name: trending.title ? 'ShowMovie' : 'ShowTVShow',
                  params: {
                    id: trending.id,
                    title: trending.title
                      ? toKebabCase(trending.title)
                      : toKebabCase(trending.name),
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
                  name: trending.title ? 'ShowMovie' : 'ShowTVShow',
                  params: {
                    id: trending.id,
                    title: trending.title
                      ? toKebabCase(trending.title)
                      : toKebabCase(trending.name),
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
  <LoaderModalComponent v-if="isFilterFetching" />
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import LoaderModalComponent from "../components/LoaderModalComponent.vue";
import FiltersComponent from "../components/FiltersComponent.vue";
import SearchResultsComponent from "../components/SearchResultsComponent.vue";
import SkeletonComponent from "../components/SkeletonComponent.vue";

import useFilterAll from "../composables/filter";
import useAllTrending from "../composables/all";

import useFilterService from "@/services/filterService";
import { toKebabCase, toOneDecimal } from "../utils/textFormatter";

const { searchResults, isFilterFetching, setSearchResults } = useFilterAll();
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
const searchInput = ref(route.query.search);

const type = ref(route.query.type);
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

    setSearchResults(searchInput.value, type.value, year.value);
  }
};

const handleTypeSelected = () => {
  if (route.query.type === "series") {
    setIsTvTypeSelected(true);
  } else if (route.query.type === "movie") {
    setIsMovieTypeSelected(true);
  } else {
    setIsTvTypeSelected(false);
    setIsMovieTypeSelected(false);
  }
};

watch(
  () => route.query.search,
  (newValue) => {
    setSearchResults(newValue, type.value, year.value);
  }
);

watch(
  [isMovieTypeSelected, isTvTypeSelected],
  ([newIsMovieTypeSelected, newIsTvTypeSelected]) => {
    if (newIsMovieTypeSelected && !newIsTvTypeSelected) {
      type.value = "movie";
    } else if (!newIsMovieTypeSelected && newIsTvTypeSelected) {
      type.value = "series";
    } else if (newIsMovieTypeSelected && newIsTvTypeSelected) {
      type.value = null;
    } else {
      type.value = null;
    }
  }
);

onMounted(async () => {
  handleTypeSelected();
  await setSearchResults(
    searchBarInput.value,
    type.value,
    year.value,
    page.value
  );
  showAllTrending(9);
});
</script>
