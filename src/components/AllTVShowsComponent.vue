<template>
  <ul
    class="grid grid-cols-2 gap-3 mt-4 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3"
  >
    <li v-for="tvshow in props.allTVShows" :key="tvshow.id">
      <router-link
        :to="{
          name: 'ShowTVShow',
          params: {
            id: tvshow.id,
            title: toKebabCase(tvshow.name),
          },
        }"
      >
        <div
          class="card rounded-lg aspect-[2/3] w-full h-auto bg-contain"
          :style="{
            'background-image':
              'url(https://image.tmdb.org/t/p/w45' + tvshow.poster_path + ')',
          }"
        >
          <img
            class="rounded-lg aspect-[2/3] w-full h-auto"
            :class="isImageLoaded ? 'opacity-100' : 'opacity-0'"
            loading="lazy"
            @load="onImageLoad()"
            :src="
              tvshow.poster_path
                ? 'https://image.tmdb.org/t/p/w300' + tvshow.poster_path
                : 'https://th.bing.com/th/id/OIP.Lr_j_PgqTGzKxJTeIwajVwHaLH?rs=1&pid=ImgDetMain'
            "
            alt=""
          />
        </div>
        <h4 class="line-clamp-1 text-center text-gray-100">
          {{ tvshow.name }}
        </h4>
      </router-link>
      <div
        class="flex items-center justify-center text-sm text-center w-full gap-1"
      >
        <span>{{ tvshow.first_air_date.split("-")[0] }}</span>
        <span>•</span>
        <span>TV</span>
      </div>
    </li>
  </ul>
</template>

<script setup>
import { ref } from "vue";
import { toKebabCase, toOneDecimal } from "../utils/textFormatter";

const props = defineProps({
  allTVShows: {
    type: Array,
    required: true,
  },
});

const isImageLoaded = ref(false);

const onImageLoad = () => {
  isImageLoaded.value = true;
};
</script>
