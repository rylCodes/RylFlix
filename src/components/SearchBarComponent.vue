<template>
  <div class="relative">
    <!-- Search Bar -->
    <div
      class="flex items-center w-full max-w-[52rem] mx-auto rounded-t-2xl bg-gray-900 transition-all duration-500 overflow-hidden"
      :class="
        props.isSearchBarOpen || $route.fullPath === '/'
          ? 'h-14 px-4 py-3'
          : 'h-0 px-0 py-0'
      "
    >
      <span
        class="bg-myViolet rounded-lg px-2 py-1 text-xs font-semibold text-gray-950"
      >
        <i class="fa-solid fa-filter"></i> Filter
      </span>

      <!-- Form -->
      <form class="flex-1 flex items-center" @submit.prevent="onSubmit()">
        <input
          @input="onTypingKeyword"
          v-model="searchInput"
          class="flex-1 bg-inherit outline-none px-2 text-sm text-gray-300 placeholder:text-gray-500"
          type="text"
          placeholder="Search movies..."
          autofocus
        />
        <button type="button" @click="onSubmit()">
          <i class="fa-solid fa-search"></i>
        </button>
      </form>
    </div>

    <!-- Result Dropdown Suggestion -->
    <div
      ref="drowDownResults"
      v-if="results.length > 0 && isDropDownResultsOpen"
      class="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-[52rem] bg-gray-800 z-10 rounded-b-2xl"
    >
      <div class="flex flex-col">
        <div
          v-for="result in results?.slice(0, 5)"
          :key="result.imdbID"
          class="flex items-center gap-2 w-full p-2 hover:bg-gray-900 transition-all duration-300"
        >
          <div class="w-10">
            <a
              @click="
                result.Type === 'movie'
                  ? showMovieDetail(result.imdbID, result.Title)
                  : showTvDetail(result.imdbID, result.Title)
              "
            >
              <img
                v-if="result.Poster"
                class="rounded-md"
                :src="
                  result.Poster !== 'N/A'
                    ? result.Poster
                    : 'https://th.bing.com/th/id/OIP.Lr_j_PgqTGzKxJTeIwajVwHaLH?rs=1&pid=ImgDetMain'
                "
                alt=""
              />
            </a>
          </div>
          <div class="flex-1">
            <a
              @click="
                result.Type === 'movie'
                  ? showMovieDetail(result.imdbID, result.Title)
                  : showTvDetail(result.imdbID, result.Title)
              "
            >
              <h6 class="font-semibold text-gray-100">
                {{ result.Title }}
              </h6>
              <div class="flex items-center gap-2 text-sm">
                <span>{{
                  result.Year + " • " + result.Type?.toUpperCase()
                }}</span>
              </div>
            </a>
          </div>
        </div>
      </div>
      <!-- Button: View all results -->
      <div class="p-3.5 rounded-b-2xl bg-gray-900">
        <button
          type="button"
          @click="onSubmit()"
          class="w-full rounded-xl bg-myViolet text-gray-900 px-1.5 py-3 text-center text-sm font-semibold hover:bg-[rgb(116 71 168)] transition-all duration-300"
        >
          View All Results <i class="mdi mdi-arrow-top-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import useFilterAll from "../composables/filter";
import { toKebabCase } from "../utils/textFormatter";

import useFilterService from "../services/filterService";

const props = defineProps({
  isSearchBarOpen: Boolean,
});

const { searchResults, isFetching, setSearchResults } = useFilterAll();

const router = useRouter();
const searchInput = ref("");
const results = ref(searchResults.value);
const drowDownResults = ref(null);
const isDropDownResultsOpen = ref(false);
let debounceTimeout;

const onTypingKeyword = async (event) => {
  isDropDownResultsOpen.value = true;
  const inputValue = event.target.value.trim();
  clearTimeout(debounceTimeout);

  debounceTimeout = setTimeout(() => {
    if (inputValue.length >= 3) {
      setSearchResults(inputValue);
    } else {
      results.value = "";
    }
  }, 300);
};

const getTmdbMovieId = async (imdbID) => {
  const response = await axios.get(
    `https://api.themoviedb.org/3/find/${imdbID}?external_source=imdb_id&api_key=9ba3f19378eba6cb60a5fd7e3b960569`
  );
  const tmdbMovieId = await response.data.movie_results[0].id;
  return tmdbMovieId;
};

const getTmdbTvId = async (imdbID) => {
  const response = await axios.get(
    `https://api.themoviedb.org/3/find/${imdbID}?external_source=imdb_id&api_key=9ba3f19378eba6cb60a5fd7e3b960569`
  );
  const tmdbTvId = await response.data.tv_results[0].id;
  return tmdbTvId;
};

const showMovieDetail = async (imdbID, title) => {
  const movieID = await getTmdbMovieId(imdbID);
  const kebabTitle = await toKebabCase(title);
  router.push({
    name: "ShowMovie",
    params: { title: kebabTitle, id: movieID },
  });
  isDropDownResultsOpen.value = false;
};

const showTvDetail = async (imdbID, title) => {
  const tvID = await getTmdbTvId(imdbID);
  const kebabTitle = await toKebabCase(title);
  router.push({
    name: "ShowTVShow",
    params: { title: kebabTitle, id: tvID },
  });
  isDropDownResultsOpen.value = false;
};

const onSubmit = () => {
  if (searchInput.value.trim() !== "") {
    router.push({
      name: "Filter",
      query: {
        search: searchInput.value,
      },
    });
    searchInput.value = "";
    isDropDownResultsOpen.value = false;
    clearTimeout(debounceTimeout);
  } else {
    return;
  }
};

const closeDropDownResults = (event) => {
  if (drowDownResults.value && !drowDownResults.value.contains(event.target)) {
    isDropDownResultsOpen.value = false;
  }
  clearTimeout(debounceTimeout);
};

watch(
  () => searchResults.value,
  (newValue) => {
    results.value = newValue;
  }
);

onMounted(() => {
  document.addEventListener("click", closeDropDownResults);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeDropDownResults);
});
</script>
