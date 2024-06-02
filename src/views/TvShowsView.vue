<template>
  <div class="flex flex-col w-full p-6 mb-10 gap-12 lg:flex-row lg:gap-4">
    <main class="flex-1">
      <h3 class="font-semibold text-2xl text-gray-100">TV SHOWS</h3>
      <!-- Filter Search -->
      <FiltersComponent
        v-model="searchInput"
        :onSubmit="onSearchingOmdb"
        :isMovieTypeSelected="isMovieTypeSelected"
        :isTvTypeSelected="isTvTypeSelected"
        :setIsMovieTypeSelected="setIsMovieTypeSelected"
        :setIsTvTypeSelected="setIsTvTypeSelected"
      />

      <!-- Grid Container TV Shows -->
      <AllTVShowsComponent
        :allTVShows="allTVShows"
        v-if="!isFetching && allTVShows.length > 0"
      />

      <SkeletonComponent v-if="isFetching" />

      <PaginationComponent
        v-if="allTVShows.length > 0"
        :onFirstPage="onFirstPage"
        :onLastPage="onLastPage"
        :onPrevPage="onPrevPage"
        :onNextPage="onNextPage"
        :currentPage="currentPage"
        :totalPages="totalPages"
      />
    </main>

    <aside class="w-full lg:w-64">
      <h3 class="font-semibold text-2xl text-gray-100">SUGGESTIONS</h3>
      <!-- Top Rated TV Shows -->
      <div class="mt-4">
        <div
          class="grid grid-cols-1 gap-2 lg:grid-cols-1 md:grid-cols-3 sm:grid-cols-2"
        >
          <div
            v-for="topRatedTVShow in topRatedTVShows"
            :key="topRatedTVShow.id"
            class="flex items-center gap-2 w-full border border-gray-800 p-2 rounded-lg hover:bg-gray-900 transition-all duration-300"
          >
            <div class="w-10">
              <router-link
                :to="{
                  name: 'ShowTVShow',
                  params: {
                    id: topRatedTVShow.id,
                    title: toKebabCase(topRatedTVShow.name),
                  },
                }"
              >
                <img
                  class="rounded-md"
                  :src="
                    'https://image.tmdb.org/t/p/w200' +
                    topRatedTVShow.poster_path
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
                    id: topRatedTVShow.id,
                    title: toKebabCase(topRatedTVShow.name),
                  },
                }"
              >
                <h6 class="font-semibold text-gray-100">
                  {{ topRatedTVShow.name }}
                </h6>
                <div class="flex items-center gap-2 text-sm">
                  <div class="flex items-center gap-1 text-yellow-500">
                    <i class="fa-solid fa-star text-xs"></i>
                    <span>{{
                      topRatedTVShow.vote_average
                        ? toOneDecimal(topRatedTVShow.vote_average)
                        : "--"
                    }}</span>
                  </div>
                  <span>•</span>
                  <span>{{ topRatedTVShow.first_air_date.split("-")[0] }}</span>
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
import { onMounted, ref, toRef, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

// Components
import PaginationComponent from "../components/PaginationComponent.vue";
import FiltersComponent from "../components/FiltersComponent.vue";
import AllTVShowsComponent from "../components/AllTVShowsComponent.vue";
import SkeletonComponent from "../components/SkeletonComponent.vue";

// Composables
import useTVShows from "../composables/tvshows";
import useFilterAll from "@/composables/filter";
import useAllTrending from "@/composables/all";

import { toKebabCase, toOneDecimal } from "../utils/textFormatter";
import useFilterService from "@/services/filterService";

const { setSearchResults } = useFilterAll();

const {
  allTVShows,
  filteredTVShows,
  topRatedTVShows,
  currentPage,
  prevPage,
  nextPage,
  totalPages,
  isFetching,
  discoverTVShows,
  showTopRatedTVShows,
} = useTVShows();

const searchInput = ref("");

const {
  isMovieTypeSelected,
  isTvTypeSelected,
  setIsMovieTypeSelected,
  setIsTvTypeSelected,
} = useFilterService();

const isFiltered = ref(false);

const type = ref("series");
const year = ref(null);
const page = ref(null);

const router = useRouter();
const route = useRoute();

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
    discoverTVShows(null, prevPage.value);
  }
};

const onNextPage = () => {
  if (nextPage.value !== null) {
    discoverTVShows(null, nextPage.value);
  }
};

const onFirstPage = () => {
  discoverTVShows();
};

const onLastPage = () => {
  discoverTVShows(null, totalPages.value);
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

    console.log(newIsMovieTypeSelected, newIsTvTypeSelected);
    console.log(type.value);
  }
);

watch(currentPage, (newPage) => {
  router.push({
    name: "TVShows",
    query: {
      page: newPage,
    },
  });
});

onMounted(() => {
  discoverTVShows(20, route.query.page);
  showTopRatedTVShows();
  setIsTvTypeSelected();
});
</script>
