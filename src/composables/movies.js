import axios from "axios";
import { ref } from "vue";

const discoverEndPoint =
  "https://api.themoviedb.org/3/discover/movie?vote_count.gte=100&api_key=9ba3f19378eba6cb60a5fd7e3b960569&";
const topRatedEndPoint =
  "https://api.themoviedb.org/3/movie/top_rated?api_key=9ba3f19378eba6cb60a5fd7e3b960569&";
const omdbEndPoint = "https://www.omdbapi.com/?apikey=f6259449&";

export default function useMovies() {
  const tmdbMovie = ref({});
  const omdbMovie = ref({});
  const recommendedMovies = ref({});
  const topRatedMovies = ref([]);
  const filteredMovies = ref([]);
  const allMovies = ref([]);
  const prevPage = ref(null);
  const currentPage = ref(0);
  const nextPage = ref(null);
  const totalPages = ref(500);
  const query = ref("");
  const isFiltered = ref(false);

  const isFetching = ref(false);

  const filterMovies = async (query, page = 1) => {
    isFetching.value = true;
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=9ba3f19378eba6cb60a5fd7e3b960569&query=${query}&page=${page}`
    );
    const results = await response.data.results;
    filteredMovies.value = results;
    isFetching.value = false;

    makePagination(response.data.page, totalPages.value);
  };

  const discoverMovies = async (resultsCount = null, page = 1) => {
    isFetching.value = true;
    const response = await axios.get(`${discoverEndPoint}page=${page}`);
    const allResults = await response.data.results;
    allMovies.value = resultsCount
      ? allResults.slice(0, resultsCount)
      : allResults;
    makePagination(response.data.page, totalPages.value); // TMDB API pages start at 1 and max at 500
    isFetching.value = false;
  };

  const showTopRatedMovies = async (page) => {
    const response = await axios.get(`${topRatedEndPoint}page=${page || 1}`);
    const firstFifteenResults = (await response.data.results).slice(0, 15);
    topRatedMovies.value = firstFifteenResults;
  };

  const showMovie = async (id) => {
    isFetching.value = true;
    const res1 = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=9ba3f19378eba6cb60a5fd7e3b960569`
    );
    const res2 = await axios.get(`${omdbEndPoint}i=${res1.data.imdb_id}`);
    tmdbMovie.value = await res1.data;
    omdbMovie.value = await res2.data;
    isFetching.value = false;
  };

  const showRecommendedMovies = async (id) => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=9ba3f19378eba6cb60a5fd7e3b960569`
    );
    recommendedMovies.value = await response.data.results;
  };

  const makePagination = (page, totalPages) => {
    currentPage.value = page;
    prevPage.value = page > 1 ? page - 1 : null;
    nextPage.value = page < totalPages ? page + 1 : null;
  };

  const setQuery = (value) => {
    query.value = value;
  };

  const setIsFiltered = (state) => {
    isFiltered.value = state;
  };

  return {
    tmdbMovie,
    omdbMovie,
    allMovies,
    recommendedMovies,
    topRatedMovies,
    prevPage,
    currentPage,
    nextPage,
    totalPages,
    filteredMovies,
    isFetching,
    query,
    isFiltered,
    setIsFiltered,
    setQuery,
    filterMovies,
    discoverMovies,
    showMovie,
    showTopRatedMovies,
    showRecommendedMovies,
  };
}
