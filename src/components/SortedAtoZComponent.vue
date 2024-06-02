<template>
  <div
    class="grid grid-cols-2 gap-3 mt-4 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3"
  >
    <div v-for="sortedShow in props.allSortedShows" :key="sortedShow.id">
      <router-link
        :to="{
          name: sortedShow.name ? 'ShowTVShow' : 'ShowMovie',
          params: {
            id: sortedShow.id,
            title: sortedShow.name
              ? toKebabCase(sortedShow.name)
              : toKebabCase(sortedShow.title),
          },
        }"
      >
        <div
          class="card rounded-lg aspect-[2/3] w-full h-auto bg-contain"
          :style="{
            'background-image':
              'url(https://image.tmdb.org/t/p/w45' +
              sortedShow.poster_path +
              ')',
          }"
        >
          <img
            :class="isImageLoaded ? 'opacity-100' : 'opacity-0'"
            class="rounded-lg aspect-[2/3] w-full h-auto"
            loading="lazy"
            @load="onImageLoad()"
            :src="
              sortedShow.poster_path
                ? 'https://image.tmdb.org/t/p/w300' + sortedShow.poster_path
                : 'https://th.bing.com/th/id/OIP.Lr_j_PgqTGzKxJTeIwajVwHaLH?rs=1&pid=ImgDetMain'
            "
            alt=""
          />
        </div>
        <h4 class="line-clamp-1 text-center text-gray-100">
          {{ sortedShow.name || sortedShow.title }}
        </h4>
      </router-link>
      <div
        class="flex items-center justify-center text-sm text-center w-full gap-1"
      >
        <span>{{
          sortedShow.first_air_date
            ? sortedShow.first_air_date &&
              sortedShow.first_air_date.split("-")[0]
            : sortedShow.release_date && sortedShow.release_date.split("-")[0]
        }}</span>
        <span>•</span>
        <span>{{ sortedShow.name ? "TV" : "MOVIE" }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { toKebabCase, toOneDecimal } from "../utils/textFormatter";

const props = defineProps({
  allSortedShows: {
    type: Array,
    required: true,
  },
});

const isImageLoaded = ref(false);

const onImageLoad = () => {
  isImageLoaded.value = true;
};
</script>
