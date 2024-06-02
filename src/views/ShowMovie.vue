<template>
  <div class="w-full mb-16">
    <div
      class="relative w-full h-full aspect-video bg-contain"
      id="movie-container"
      :style="
        !isVideoPlaying && {
          'background-image':
            'url(https://image.tmdb.org/t/p/w300' +
            tmdbMovie.backdrop_path +
            ')',
        }
      "
      @click="playVideo()"
    >
      <img
        v-if="!isVideoPlaying"
        @class="isImageLoaded ? 'opacity-100' : 'opacity-0'"
        class="absolute top-0 left-0 w-full h-auto"
        @load="onImageLoad()"
        :key="imageKey"
        :src="'https://image.tmdb.org/t/p/w1280' + tmdbMovie.backdrop_path"
        loading="lazy"
        alt=""
      />
      <div
        v-if="!isVideoPlaying"
        class="absolute top-0 left-0 w-full h-full vignette"
      ></div>
      <img
        v-if="!isVideoPlaying"
        class="cursor-pointer animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-auto hover:scale-125 hover:animate-none transition-transform duration-300 lg:w-16 md:w-14"
        src="../assets/play-button.svg"
        alt=""
      />
      <iframe
        v-if="isVideoPlaying"
        class="w-full aspect-video"
        :src="
          'https://vidsrc.to/embed/movie/' +
          (omdbMovie.imdbID ? omdbMovie.imdbID : tmdbMovie.id)
        "
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
    <div
      class="flex flex-col-reverse gap-8 w-full p-4 mt-6 lg:flex-row lg:gap-4"
    >
      <div
        class="relative flex flex-col border border-gray-700 rounded-2xl overflow-hidden flex-1"
      >
        <div
          class="absolute top-0 right-1/2 translate-x-1/2 lg:right-0 lg:translate-x-0"
        >
          <StarRatingComponent
            :rating="
              tmdbMovie.vote_average
                ? tmdbMovie.vote_average
                : omdbMovie.imdbRating
            "
            :reviews="
              tmdbMovie.vote_count ? tmdbMovie.vote_count : omdbMovie.imdbVotes
            "
          />
        </div>
        <div class="flex gap-4">
          <div
            class="absolute w-full h-fit -z-10 opacity-15 aspect-[2/3] lg:static lg:w-56 lg:h-fit lg:opacity-100 bg-contain"
            :style="{
              'background-image':
                'url(https://image.tmdb.org/t/p/w45' +
                tmdbMovie.poster_path +
                ')',
            }"
          >
            <img
              :class="isImageLoaded ? 'opacity-100' : 'opacity-0'"
              class="aspect-[2/3] w-full h-auto rounded-xl"
              :src="'https://image.tmdb.org/t/p/w300' + tmdbMovie.poster_path"
              loading="lazy"
              @load="onImageLoad()"
              alt=""
            />
          </div>
          <div
            class="flex-1 flex flex-col w-full gap-2 text-sm px-4 py-6 mt-16 lg:mt-0 md:mt-56"
          >
            <h4 class="text-2xl text-slate-100 font-semibold sm:text-3xl">
              {{ omdbMovie.Title || tmdbMovie.title }}
            </h4>
            <div class="flex items-center gap-2 text-base">
              <span
                v-if="omdbMovie.Rated"
                class="px-1 font-semibold rounded-md border"
                >{{ omdbMovie.Rated }}</span
              >
              <div class="flex items-center">
                <span class="material-symbols-outlined">stars</span>
                <span>{{
                  (tmdbMovie.vote_average &&
                    toOneDecimal(tmdbMovie.vote_average)) ||
                  (omdbMovie.imdbRating && toOneDecimal(omdbMovie.imdbRating))
                }}</span>
              </div>
              <span>{{ tmdbMovie.runtime + "min" || omdbMovie.Runtime }}</span>
            </div>
            <p>{{ tmdbMovie.overview }}</p>
            <div>
              <div class="flex items-center w-full capitalize">
                <span class="w-24">Type:</span>
                <span class="flex-1 text-gray-300">{{
                  omdbMovie.Type || "Movie"
                }}</span>
              </div>
              <div class="flex items-center w-full capitalize">
                <span class="w-24">Country:</span>
                <span class="flex-1 text-gray-300">
                  {{
                    omdbMovie.Country ||
                    (tmdbMovie.origin_country && tmdbMovie.origin_country[0])
                  }}
                </span>
              </div>
              <div class="flex items-center w-full capitalize">
                <span class="w-24">Genre:</span>
                <span class="flex-1 text-gray-300">
                  {{
                    omdbMovie.Genre ||
                    (tmdbMovie.genres &&
                      tmdbMovie.genres.map((genre) => genre.name).join(", "))
                  }}
                </span>
              </div>
              <div class="flex items-center w-full capitalize">
                <span class="w-24">Release:</span>
                <span class="flex-1 text-gray-300">
                  {{
                    (omdbMovie.Released &&
                      formatDateToLong(omdbMovie.Released)) ||
                    (tmdbMovie.release_date &&
                      formatDateToLong(tmdbMovie.release_date))
                  }}
                </span>
              </div>
              <div
                v-if="omdbMovie.Director"
                class="flex items-center w-full capitalize"
              >
                <span class="w-24">Director:</span>
                <span class="flex-1 text-gray-300">{{
                  omdbMovie.Director
                }}</span>
              </div>
              <div class="flex items-center w-full capitalize">
                <span class="w-24">Production:</span>
                <span class="flex-1 text-gray-300">
                  {{
                    omdbMovie.Production ||
                    (tmdbMovie.production_companies &&
                      tmdbMovie.production_companies
                        .map((production) => production.name)
                        .join(", "))
                  }}
                </span>
              </div>
              <div
                v-if="omdbMovie.Actors"
                class="flex items-center w-full capitalize"
              >
                <span class="w-24">Actors:</span>
                <span class="flex-1 text-gray-300">{{ omdbMovie.Actors }}</span>
              </div>
              <div
                v-if="omdbMovie.Writer"
                class="flex items-center w-full capitalize"
              >
                <span class="w-24">Writers:</span>
                <span class="flex-1 text-gray-300">{{ omdbMovie.Writer }}</span>
              </div>
              <div class="flex items-center w-full capitalize">
                <span class="w-24">Language:</span>
                <span class="flex-1 text-gray-300">
                  {{
                    omdbMovie.Language ||
                    (tmdbMovie.spoken_languages &&
                      tmdbMovie.spoken_languages
                        .map((language) => language.english_name)
                        .join(", "))
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside
        class="w-full lg:w-72 border border-gray-700 rounded-2xl overflow-hidden"
      >
        <h5
          class="text-center font-semibold hover:bg-purple-500 hover:text-gray-100 px-4 py-2 rounded-t-xl transition-colors duration-300"
        >
          Movie Files
        </h5>
        <ul class="bg-gray-900">
          <li
            class="cursor-pointer py-2 px-4 whitespace-nowrap overflow-x-clip hover:bg-gray-800 border-l border-transparent hover:border-purple-500 hover:text-gray-100 transition-all duration-300"
            @click="onSelectMovie()"
          >
            {{ tmdbMovie.title || omdbMovie.Title }}
          </li>
        </ul>
      </aside>
    </div>
    <!-- Recommended Movies -->
    <div class="p-4 mt-6">
      <h5 class="font-semibold text-2xl text-gray-100">RECOMMENDED</h5>
      <div
        v-if="recommendedMovies.length"
        class="grid grid-cols-1 gap-2 mt-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2"
      >
        <div
          v-for="recommendedMovie in recommendedMovies"
          :key="recommendedMovie.id"
          class="flex items-center gap-2 w-full border border-gray-800 p-2 rounded-lg hover:bg-gray-900 transition-all duration-300"
        >
          <div class="w-10">
            <router-link
              :to="{
                name: 'ShowMovie',
                params: {
                  id: recommendedMovie.id,
                  title: toKebabCase(recommendedMovie.title),
                },
              }"
            >
              <img
                class="rounded-md"
                :src="
                  'https://image.tmdb.org/t/p/w200' +
                  recommendedMovie.poster_path
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
                  id: recommendedMovie.id,
                  title: toKebabCase(recommendedMovie.title),
                },
              }"
            >
              <h6 class="font-semibold text-gray-100">
                {{ recommendedMovie.title }}
              </h6>
              <div class="flex items-center gap-2 text-sm">
                <div class="flex items-center gap-1 text-yellow-500">
                  <i class="fa-solid fa-star text-xs"></i>
                  <span>{{
                    recommendedMovie.vote_average
                      ? toOneDecimal(recommendedMovie.vote_average)
                      : "--"
                  }}</span>
                </div>
                <span>•</span>
                <span>{{ recommendedMovie.release_date.split("-")[0] }}</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <div v-if="!recommendedMovies.length" class="p-4 mt-4">
        No recommended movie found!
      </div>
    </div>
    <LoaderModalComponent v-if="isFetching" />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

import useMovies from "../composables/movies";

import LoaderModalComponent from "../components/LoaderModalComponent.vue";
import StarRatingComponent from "../components/StarRatingComponent.vue";

import { formatDateToLong } from "../utils/dateFormatter";
import { toKebabCase, toOneDecimal } from "../utils/textFormatter";

const {
  omdbMovie,
  tmdbMovie,
  recommendedMovies,
  isFetching,
  showMovie,
  showRecommendedMovies,
} = useMovies();

const route = useRoute();
const movieID = ref(route.params.id);
const imageKey = ref(Date.now());
const isImageLoaded = ref(false);
const isVideoPlaying = ref(false);

const playVideo = () => (isVideoPlaying.value = true);

const onImageLoad = () => {
  isImageLoaded.value = true;
};

const onSelectMovie = () => {
  const video = document.querySelector("#movie-container");
  video?.scrollIntoView({ behavior: "smooth", block: "center" });
};

watch(
  () => route.params.id,
  (newMovieID) => {
    isVideoPlaying.value = false;
    movieID.value = newMovieID;
    showMovie(newMovieID);
    showRecommendedMovies(newMovieID);
    imageKey.value = Date.now();
  }
);

onMounted(() => {
  showMovie(movieID.value);
  showRecommendedMovies(movieID.value);
});

// defineOptions({ inheritAttrs: false });
console.log("omdb: ", omdbMovie);
console.log("tmdb: ", tmdbMovie);
</script>
