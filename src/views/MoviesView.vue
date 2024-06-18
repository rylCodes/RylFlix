<template>
  <div class="flex flex-col w-full p-6 mb-10 gap-12 lg:flex-row lg:gap-4">
    <main class="flex-1">
      <h3 class="font-semibold text-2xl text-gray-100">MOVIES</h3>
      <!-- Filter Search -->
      <FiltersComponent
        v-model="searchInput"
        :onSubmit="onSearchingOmdb"
        :isMovieTypeSelected="isMovieTypeSelected"
        :isTvTypeSelected="isTvTypeSelected"
        :setIsMovieTypeSelected="setIsMovieTypeSelected"
        :setIsTvTypeSelected="setIsTvTypeSelected"
      />

      <!-- Grid Container Movies -->
      <AllMoviesComponent
        :allMovies="allMovies"
        v-if="!isFetching && allMovies.length > 0"
      />

      <SkeletonComponent v-if="isFetching" />

      <PaginationComponent
        v-if="allMovies.length > 0"
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
            v-for="topRatedMovie in topRatedMovies"
            :key="topRatedMovie.id"
            class="flex items-center gap-2 w-full border border-gray-800 p-2 rounded-lg hover:bg-gray-900 transition-all duration-300"
          >
            <div class="w-10">
              <router-link
                :to="{
                  name: 'ShowMovie',
                  params: {
                    id: topRatedMovie.id,
                    title: toKebabCase(topRatedMovie.title),
                  },
                }"
              >
                <img
                  v-if="topRatedMovie.poster_path"
                  class="rounded-md"
                  :src="
                    'https://image.tmdb.org/t/p/w200' +
                    topRatedMovie.poster_path
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
                    id: topRatedMovie.id,
                    title: toKebabCase(topRatedMovie.title),
                  },
                }"
              >
                <h6 class="font-semibold text-gray-100 line-clamp-1">
                  {{ topRatedMovie.title }}
                </h6>
                <div class="flex items-center gap-2 text-sm">
                  <div class="flex items-center gap-1 text-yellow-500">
                    <i class="fa-solid fa-star text-xs"></i>
                    <span>{{
                      topRatedMovie.vote_average
                        ? toOneDecimal(topRatedMovie.vote_average)
                        : "--"
                    }}</span>
                  </div>
                  <span>•</span>
                  <span>{{ topRatedMovie.release_date.split("-")[0] }}</span>
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
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

// Composables
import useAllTrending from "@/composables/all";
import useFilterAll from "@/composables/filter";
import useMovies from "../composables/movies";

// Components
import PaginationComponent from "../components/PaginationComponent.vue";
import AllMoviesComponent from "../components/AllMoviesComponent.vue";
import FiltersComponent from "../components/FiltersComponent.vue";
import SkeletonComponent from "../components/SkeletonComponent.vue";

import useFilterService from "@/services/filterService";
import { toKebabCase, toOneDecimal } from "../utils/textFormatter";

const { setSearchResults } = useFilterAll();

const {
  allMovies,
  topRatedMovies,
  currentPage,
  prevPage,
  nextPage,
  totalPages,
  filteredMovies,
  isFetching,
  discoverMovies,
  showTopRatedMovies,
} = useMovies();

const {
  isMovieTypeSelected,
  isTvTypeSelected,
  setIsMovieTypeSelected,
  setIsTvTypeSelected,
} = useFilterService();

const router = useRouter();
const route = useRoute();

const searchInput = ref("");

const type = ref("movie");
const year = ref(null);
const page = ref(null);

const onSearchingOmdb = () => {
  if (searchInput.value.trim() !== "") {
    const query = {
      search: searchInput.value,
    };

    if (type.value) {
      query.type = type.value;
    }

    router.push({
      name: "Filter",
      query,
    });

    setSearchResults(searchInput.value, type.value, year.value, page.value);
  }
};

const onPrevPage = () => {
  if (prevPage.value !== null) {
    discoverMovies(null, prevPage.value);
  }
};

const onNextPage = () => {
  if (nextPage.value !== null) {
    discoverMovies(null, nextPage.value);
  }
};

const onFirstPage = () => {
  discoverMovies();
};

const onLastPage = () => {
  discoverMovies(null, totalPages.value);
};

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

watch(currentPage, (newPage) => {
  router.push({
    name: "Movies",
    query: {
      page: newPage,
    },
  });
});

onMounted(() => {
  discoverMovies(20, route.query.page);
  showTopRatedMovies();
  setIsMovieTypeSelected();
});
</script>
