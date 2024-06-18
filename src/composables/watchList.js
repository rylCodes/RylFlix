import { ref } from "vue";
import { useRouter } from "vue-router";
import swal from "sweetalert";
import axios from "axios";

const apiKey = "9ba3f19378eba6cb60a5fd7e3b960569";
const accessToken =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YmEzZjE5Mzc4ZWJhNmNiNjBhNWZkN2UzYjk2MDU2OSIsInN1YiI6IjY2M2ZhZDA1Y2VjZjM0NjNjZmY5ZmI5YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XdhdZoSfBioEtXmwbKa5qydGZ6c2VLGO2CWcQKoHZaM";

const movieWatchList = ref([]);
const favoriteMovies = ref([]);
const isFetching = ref(false);
const requestToken = localStorage.getItem("request_token");

export default function useWatchList() {
  const getMovieWatchList = async (page = 1) => {
    isFetching.value = true;
    try {
      if (requestToken) {
        const response = await fetch(
          `https://api.themoviedb.org/3/account/${JSON.parse(
            requestToken
          )}/watchlist/movies?language=en-US&page=${page}&sort_by=created_at.asc`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          console.error("An expected error occured", response);
          return;
        }

        const data = await response.json();
        movieWatchList.value = data.results;
        isFetching.value = false;
      }
    } catch (error) {
      if (error instanceof Error) console.log(e.stack);
      isFetching.value = false;
    }
  };

  const getFavoriteMovies = async (page = 1) => {
    isFetching.value = true;
    try {
      if (requestToken) {
        const response = await fetch(
          `https://api.themoviedb.org/3/account/${JSON.parse(
            requestToken
          )}/favorite/movies?language=en-US&page=${page}&sort_by=created_at.asc`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          console.error("An expected error occured", response);
          return;
        }

        const data = await response.json();
        favoriteMovies.value = data.results;
        isFetching.value = false;
      }
    } catch (error) {
      if (error instanceof Error) console.log(e.stack);
      isFetching.value = false;
    }
  };

  const addToFavorite = async (movieId) => {
    try {
      if (requestToken) {
        const response = await axios.post(
          `https://api.themoviedb.org/3/account/${JSON.parse(
            requestToken
          )}/favorite`,
          {
            media_type: "movie",
            media_id: movieId,
            favorite: true,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const result = await response.data;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    isFetching,
    movieWatchList,
    favoriteMovies,
    getMovieWatchList,
    getFavoriteMovies,
    addToFavorite,
  };
}
