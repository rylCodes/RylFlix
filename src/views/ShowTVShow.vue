<template>
  <div class="w-full min-h-svh mb-16">
    <div
      :key="backdropKey"
      class="relative w-full h-full aspect-video bg-cover bg-center"
      id="tvshow-container"
      :style="
        !isVideoPlaying && {
          'background-image':
            'url(https://image.tmdb.org/t/p/w300' +
            tmdbTVShow.backdrop_path +
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
        :src="'https://image.tmdb.org/t/p/w1280' + tmdbTVShow.backdrop_path"
        loading="lazy"
        alt=""
      />
      <div
        v-if="!isVideoPlaying"
        class="absolute top-0 left-0 w-full h-full vignette"
      ></div>
      <img
        v-if="!isVideoPlaying"
        class="drop-shadow-md cursor-pointer animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-auto hover:scale-125 hover:animate-none transition-transform duration-300 lg:w-16 md:w-14"
        src="../assets/play-button.svg"
        alt="play-button"
      />
      <div class="w-full h-auto aspect-video">
        <iframe
          :key="videoKey"
          v-if="isVideoPlaying"
          class="w-full h-auto aspect-video"
          :src="`https://vidsrc.to/embed/tv/${
            tmdbTVShow.id || omdbTVShow.imdbID
          }/${seasonNumber}/${episodeNumber}`"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>
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
            v-if="tmdbTVShow.vote_average || omdbTVShow.imdbRating !== 'N/A'"
            :rating="
              tmdbTVShow.vote_average
                ? tmdbTVShow.vote_average
                : omdbTVShow.imdbRating
            "
            :reviews="
              tmdbTVShow.vote_count
                ? tmdbTVShow.vote_count
                : omdbTVShow.imdbVotes
            "
          />
        </div>

        <!-- Skeleton TV Show Details -->
        <DetailSkeleton v-if="isFetching" />

        <div class="flex gap-4" v-if="!isFetching">
          <div
            class="absolute w-full h-fit -z-10 opacity-15 aspect-[2/3] lg:static lg:w-56 lg:h-fit lg:opacity-100 bg-contain"
            :style="{
              'background-image':
                'url(https://image.tmdb.org/t/p/w45' +
                (seasonInfo.poster_path || tmdbTVShow.poster_path) +
                ')',
            }"
          >
            <img
              :class="isImageLoaded ? 'opacity-100' : 'opacity-0'"
              :key="posterKey"
              class="aspect-[2/3] w-full h-auto rounded-xl"
              :src="
                'https://image.tmdb.org/t/p/w300' +
                  (seasonInfo.poster_path || tmdbTVShow.poster_path) ||
                omdbTVShow.Poster
              "
              loading="lazy"
              @load="onImageLoad()"
              alt=""
            />
          </div>
          <div
            class="flex-1 flex flex-col w-full gap-2 text-sm px-4 py-6 mt-16 lg:mt-0 md:mt-56"
          >
            <h4
              v-if="tmdbTVShow.name"
              class="text-2xl text-slate-100 font-semibold xl:max-w-lg lg:max-w-xs sm:text-3xl"
            >
              {{ tmdbTVShow.name }}
            </h4>
            <div class="flex items-center gap-2 text-base">
              <span
                v-if="omdbTVShow.Rated"
                class="px-1 font-semibold rounded-md border"
                >{{ omdbTVShow.Rated }}</span
              >
              <div class="flex items-center">
                <span
                  v-if="
                    tmdbTVShow.vote_average || omdbTVShow.imdbRating !== 'N/A'
                  "
                  class="material-symbols-outlined"
                  >stars</span
                >
                <span
                  v-if="
                    tmdbTVShow.vote_average || omdbTVShow.imdbRating !== 'N/A'
                  "
                >
                  {{
                    tmdbTVShow.vote_average
                      ? toOneDecimal(tmdbTVShow.vote_average)
                      : omdbTVShow.imdbRating
                  }}</span
                >
              </div>
              <span
                v-if="
                  (tmdbTVShow.episode_run_time &&
                    tmdbTVShow.episode_run_time.length > 0) ||
                  omdbTVShow.Runtime
                "
                >{{
                  tmdbTVShow.episode_run_time.length !== 0
                    ? tmdbTVShow.episode_run_time[0] + " min"
                    : omdbTVShow.Runtime
                }}</span
              >
            </div>
            <p v-if="tmdbTVShow.overview">{{ tmdbTVShow.overview }}</p>
            <div>
              <div
                v-if="tmdbTVShow.origin_country"
                class="flex items-center w-full capitalize"
              >
                <span class="w-24">Country:</span>
                <span class="flex-1 text-gray-300">{{
                  tmdbTVShow.origin_country
                    ? tmdbTVShow.origin_country.join(", ")
                    : ""
                }}</span>
              </div>
              <div
                v-if="tmdbTVShow.genres"
                class="flex items-center w-full capitalize"
              >
                <span class="w-24">Genre:</span>
                <span class="flex-1 text-gray-300">{{
                  tmdbTVShow.genres ? arrayToString(tmdbTVShow.genres) : ""
                }}</span>
              </div>
              <div
                v-if="tmdbTVShow.first_air_date"
                class="flex items-center w-full capitalize"
              >
                <span class="w-24">Release:</span>
                <span class="flex-1 text-gray-300">{{
                  tmdbTVShow.first_air_date
                    ? formatDateToLong(tmdbTVShow.first_air_date)
                    : ""
                }}</span>
              </div>
              <div
                v-if="omdbTVShow.Actors"
                class="flex items-center w-full capitalize"
              >
                <span class="w-24">Actors:</span>
                <span class="flex-1 text-gray-300">{{
                  omdbTVShow.Actors
                }}</span>
              </div>
              <div
                v-if="tmdbTVShow.number_of_episodes"
                class="flex items-center w-full capitalize"
              >
                <span class="w-24">Episodes:</span>
                <span class="flex-1 text-gray-300">{{
                  tmdbTVShow.number_of_episodes
                }}</span>
              </div>
              <div
                v-if="tmdbTVShow.number_of_seasons"
                class="flex items-center w-full capitalize"
              >
                <span class="w-24">Seasons:</span>
                <span class="flex-1 text-gray-300">{{
                  tmdbTVShow.number_of_seasons
                }}</span>
              </div>
              <div
                v-if="tmdbTVShow.production_companies"
                class="flex items-center w-full capitalize"
              >
                <span class="w-24">Production:</span>
                <span class="flex-1 text-gray-300">{{
                  omdbTVShow.Production !== "N/A"
                    ? omdbTVShow.Production
                    : tmdbTVShow.production_companies &&
                      arrayToString(tmdbTVShow.production_companies)
                }}</span>
              </div>
              <div
                v-if="tmdbTVShow.spoken_languages"
                class="flex items-center w-full capitalize"
              >
                <span class="w-24">Languages:</span>
                <span class="flex-1 text-gray-300">{{
                  tmdbTVShow.spoken_languages
                    ? arrayToString(tmdbTVShow.spoken_languages)
                    : ""
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <aside
        class="w-full lg:w-72 border border-gray-700 rounded-2xl overflow-hidden"
      >
        <div ref="seasonOptions" class="relative">
          <button
            type="button"
            @click="toggleSeasons()"
            class="flex items-center justify-center gap-1 w-full px-4 py-2 hover:bg-violet-500 hover:text-gray-100 rounded-t-xl transition-colors duration-300 font-semibold"
          >
            <i class="mdi mdi-view-split-horizontal"></i>
            <span>{{
              seasonInfo.name ||
              (tmdbTVShow.seasons && showSeasonOne(tmdbTVShow))
            }}</span>
            <i class="fa-solid fa-caret-down"></i>
          </button>
          <ol
            @click="toggleSeasons()"
            class="absolute top-[110%] left-1/2 -translate-x-1/2 w-52 rounded-lg text-center h-0 text-sm font-medium max-h-64 bg-gray-800 overflow-y-auto transition-all duration-300"
            :class="isSeasonOptionsOpen ? 'h-auto' : 'h-0'"
          >
            <li
              v-for="season in tmdbTVShow.seasons"
              :key="season.id"
              class="cursor-pointer py-1 hover:bg-violet-500 hover:text-gray-100"
              :class="{
                'bg-violet-500 text-gray-100':
                  seasonNumber === season.season_number,
              }"
              @click="onSelectSeason(season)"
            >
              {{ season.name }}
            </li>
          </ol>
        </div>
        <div class="max-h-96 min-h-72 overflow-y-auto">
          <ol
            v-for="episode in seasonDetails.episodes &&
            filterByTodayLatest(seasonDetails.episodes)"
            :key="episode.id"
            class="odd:bg-gray-900"
          >
            <li
              class="cursor-pointer py-2 px-4 whitespace-nowrap overflow-x-clip hover:bg-gray-800 border-l border-transparent hover:border-violet-500 hover:text-gray-100 transition-all duration-300 text-sm"
              :class="{
                'bg-gray-700 text-gray-100 hover:bg-gray-700':
                  episode.episode_number === episodeNumber,
              }"
              @click="onSelectEpisode(episode)"
            >
              Episode {{ episode.episode_number }}: {{ episode.name }}
            </li>
          </ol>
        </div>
      </aside>
    </div>
    <!-- Recommended TV Shows -->
    <div class="p-4 mt-6">
      <h5 class="font-semibold text-2xl text-gray-100">RECOMMENDED</h5>
      <div
        v-if="recommendedTVShows.length"
        class="grid grid-cols-1 gap-2 mt-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2"
      >
        <div
          v-for="recommendedTVShows in recommendedTVShows"
          :key="recommendedTVShows.id"
          class="flex items-center gap-2 w-full border border-gray-800 p-2 rounded-lg hover:bg-gray-900 transition-all duration-300"
        >
          <div class="w-10">
            <router-link
              :to="{
                name: 'ShowTVShow',
                params: {
                  id: recommendedTVShows.id,
                  title: toKebabCase(recommendedTVShows.name),
                },
              }"
            >
              <img
                :key="posterKey"
                class="rounded-md"
                :src="
                  'https://image.tmdb.org/t/p/w200' +
                  recommendedTVShows.poster_path
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
                  id: recommendedTVShows.id,
                  title: toKebabCase(recommendedTVShows.name),
                },
              }"
            >
              <h6 class="font-semibold text-gray-100">
                {{ recommendedTVShows.name }}
              </h6>
              <div class="flex items-center gap-2 text-sm">
                <div class="flex items-center gap-1 text-yellow-500">
                  <i class="fa-solid fa-star text-xs"></i>
                  <span>{{
                    recommendedTVShows.vote_average
                      ? toOneDecimal(recommendedTVShows.vote_average)
                      : "--"
                  }}</span>
                </div>
                <span>•</span>
                <span>{{
                  recommendedTVShows.first_air_date?.split("-")[0]
                }}</span>
              </div>
            </router-link>
          </div>
        </div>

        <!-- No recommended tv show found| -->
        <div v-if="!recommendedTVShows.length" class="p-4 mt-4">
          No recommended movie found!
        </div>
      </div>
    </div>
    <LoaderModalComponent v-if="isFetching" />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import useTVShows from "../composables/tvshows";
import {
  onMounted,
  ref,
  watch,
  toRef,
  computed,
  nextTick,
  onBeforeUnmount,
} from "vue";
import { formatDateToLong } from "../utils/dateFormatter";
import {
  toKebabCase,
  toOneDecimal,
  arrayToString,
} from "../utils/textFormatter";
import LoaderModalComponent from "@/components/LoaderModalComponent.vue";
import StarRatingComponent from "../components/StarRatingComponent.vue";
import DetailSkeleton from "../components/DetailSkeleton.vue";

const {
  tmdbTVShow,
  omdbTVShow,
  seasonDetails,
  episodeDetails,
  recommendedTVShows,
  isFetching,
  showTVShow,
  showSeasonDetails,
  showEpisodeDetails,
} = useTVShows();

const route = useRoute();

const tvshowID = ref(route.params.id);
const backdropKey = ref(Date.now());
const posterKey = ref(Date.now());
const videoKey = ref(Date.now());
const seasonInfo = ref(seasonDetails);
const seasonNumber = ref(1);
const episodeNumber = ref(1);
const isSeasonOptionsOpen = ref(false);
const seasonOptions = ref(null);
const isImageLoaded = ref(false);
const isVideoPlaying = ref(false);

const playVideo = () => (isVideoPlaying.value = true);

const onImageLoad = () => {
  isImageLoaded.value = true;
};

const toggleSeasons = () => {
  isSeasonOptionsOpen.value = !isSeasonOptionsOpen.value;
};

const showSeasonOne = (tvShow) => {
  const season = tvShow.seasons.filter((season) => season.season_number === 1);
  return season[0].name;
};

const onSelectSeason = (season) => {
  seasonInfo.value = season;
  seasonNumber.value = season.season_number;
  showSeasonDetails(tvshowID.value, season.season_number);
};

const onSelectEpisode = (episode) => {
  episodeNumber.value = episode.episode_number;
  const video = document.querySelector("#tvshow-container");
  video?.scrollIntoView({ behavior: "smooth", block: "center" });
};

const closeSeasonOptions = (event) => {
  if (seasonOptions.value && !seasonOptions.value.contains(event.target)) {
    isSeasonOptionsOpen.value = false;
  }
};

const filterByTodayLatest = (array) => {
  const today = new Date();
  // today.setHours(0, 0, 0, 0);
  const filteredArray = array.filter((item) => {
    const airDate = new Date(item.air_date);
    return airDate <= today;
  });

  return filteredArray;
};

onMounted(() => {
  showTVShow(tvshowID.value);
  showSeasonDetails(tvshowID.value);
  showEpisodeDetails(tvshowID.value);

  document.addEventListener("click", closeSeasonOptions);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeSeasonOptions);
});

watch(
  () => route.params.id,
  (newTVShowID) => {
    isVideoPlaying.value = false;
    tvshowID.value = newTVShowID;
    backdropKey.value = Date.now();
    videoKey.value = Date.now();
    posterKey.value = Date.now();
    showTVShow(newTVShowID);
    showSeasonDetails(newTVShowID, 1);
    showEpisodeDetails(newTVShowID, 1);
    seasonNumber.value = 1;
    episodeNumber.value = 1;
  }
);

watch(seasonNumber, (newSeasonNumber) => {
  isVideoPlaying.value = false;
  episodeNumber.value = 1;
  videoKey.value = Date.now();
  posterKey.value = Date.now();
});

watch(episodeNumber, (newEpisodeNumber) => {
  isVideoPlaying.value = false;
  videoKey.value = Date.now();
});

watch(seasonDetails, (newSeasonDetails) => {
  seasonInfo.value = newSeasonDetails;
});

// defineOptions({ inheritAttrs: false });
// console.log(omdbTVShow, tmdbTVShow);
</script>
