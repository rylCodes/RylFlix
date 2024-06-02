<template>
  <div
    class="grid grid-cols-2 gap-3 mt-4 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3"
  >
    <div v-for="result in props.searchResults" :key="result.imdbID">
      <a @click="showDetail(result.imdbID, result.Title, result.Type)">
        <div class="card">
          <img
            class="rounded-lg aspect-[2/3] w-full h-auto"
            loading="lazy"
            :src="
              result.Poster !== 'N/A'
                ? result.Poster
                : 'https://th.bing.com/th/id/OIP.Lr_j_PgqTGzKxJTeIwajVwHaLH?rs=1&pid=ImgDetMain'
            "
            alt=""
          />
        </div>
        <h4 class="line-clamp-1 text-center text-gray-100">
          {{ result.Title }}
        </h4>
      </a>
      <div
        class="flex items-center justify-center text-sm text-center w-full gap-1"
      >
        <span>{{ result.Year }}</span>
        <span>•</span>
        <span class="uppercase">{{ result.Type }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { useRouter } from "vue-router";
import { toKebabCase } from "../utils/textFormatter";

const router = useRouter();

const getTmdbId = async (imdbID) => {
  const response = await axios.get(
    `https://api.themoviedb.org/3/find/${imdbID}?external_source=imdb_id&api_key=9ba3f19378eba6cb60a5fd7e3b960569`
  );
  const id =
    response.data.movie_results.length > 0
      ? response.data.movie_results[0].id
      : response.data.tv_results[0].id;
  return id;
};

const showDetail = async (imdbID, title, type) => {
  const tmdbID = await getTmdbId(imdbID);
  const kebabTitle = await toKebabCase(title);
  router.push({
    name: type === "movie" ? "ShowMovie" : "ShowTVShow",
    params: { title: kebabTitle, id: tmdbID },
  });
};

const props = defineProps({
  searchResults: Array,
});
</script>
