import axios from "axios";
import { ref } from "vue";

const discoverEndPoint =
  "https://api.themoviedb.org/3/discover/tv?vote_count.gte=100&api_key=9ba3f19378eba6cb60a5fd7e3b960569&include_adult=true&";
const topRatedEndPoint =
  "https://api.themoviedb.org/3/tv/top_rated?api_key=9ba3f19378eba6cb60a5fd7e3b960569&";
const omdbEndPoint = "https://www.omdbapi.com/?apikey=f6259449&";

export default function useTVShows() {
  const tmdbTVShow = ref({});
  const omdbTVShow = ref({});
  const seasonDetails = ref({});
  const episodeDetails = ref({});
  const recommendedTVShows = ref({});
  const topRatedTVShows = ref({});
  const filteredTVShows = ref([]);
  const allTVShows = ref([]);
  const prevPage = ref(null);
  const currentPage = ref(0);
  const nextPage = ref(null);
  const totalPages = ref(169);
  const isFetching = ref(false);

  const filterTVShows = async (query, page = 1) => {
    isFetching.value = true;
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/tv?api_key=9ba3f19378eba6cb60a5fd7e3b960569&vote_count.gte=100&query=${query}&page=${page}`
      );
      const results = await response.data.results;
      filteredTVShows.value = results;
    } catch (error) {
      throw new Error("Error fetching filtered TV Shows", error);
    } finally {
      isFetching.value = false;
    }

    makePagination(response.data.page, totalPages.value);
  };

  const discoverTVShows = async (resultsCount = null, page = 1) => {
    isFetching.value = true;
    try {
      const response = await axios.get(`${discoverEndPoint}page=${page}`);
      const allResults = await response.data.results;
      allTVShows.value = resultsCount
        ? allResults.slice(0, resultsCount)
        : allResults;
      makePagination(response.data.page, totalPages.value); // TMDB API tvshow pages start at 1 and max at 169
    } catch (error) {
      throw new Error("Error fetching TV Shows.", error);
    } finally {
      isFetching.value = false;
    }
  };

  const showTopRatedTVShows = async (page) => {
    const response = await axios.get(`${topRatedEndPoint}page=${page || 1}`);
    const firstFifteenResults = (await response.data.results).slice(0, 15);
    topRatedTVShows.value = firstFifteenResults;
  };

  const showTVShow = async (id) => {
    isFetching.value = true;
    try {
      const res1 = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}?api_key=9ba3f19378eba6cb60a5fd7e3b960569`
      );
      const res2 = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=9ba3f19378eba6cb60a5fd7e3b960569&page=2`
      );
      const res3 = await axios.get(`${omdbEndPoint}t=${res1.data.name}`);
      tmdbTVShow.value = await res1.data;
      recommendedTVShows.value = await res2.data.results;
      omdbTVShow.value = await res3.data;
    } catch (error) {
      throw new Error("Error fetching a TV Show", error);
    } finally {
      isFetching.value = false;
    }
  };

  const showSeasonDetails = async (id, season = 1) => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/tv/${id}/season/${season}?language=en-US&api_key=9ba3f19378eba6cb60a5fd7e3b960569`
    );
    const results = await response.data;
    seasonDetails.value = results;
  };

  const showEpisodeDetails = async (id, season = 1, episode = 1) => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/tv/${id}/season/${season}/episode/${episode}?api_key=9ba3f19378eba6cb60a5fd7e3b960569`
    );
    const results = await response.data;
    episodeDetails.value = results;
  };

  const makePagination = (page, totalPages) => {
    currentPage.value = page;
    prevPage.value = page > 1 ? page - 1 : null;
    nextPage.value = page < totalPages ? page + 1 : null;
  };

  return {
    tmdbTVShow,
    omdbTVShow,
    allTVShows,
    filteredTVShows,
    seasonDetails,
    episodeDetails,
    recommendedTVShows,
    topRatedTVShows,
    prevPage,
    currentPage,
    nextPage,
    totalPages,
    isFetching,
    discoverTVShows,
    showTVShow,
    showTopRatedTVShows,
    showSeasonDetails,
    showEpisodeDetails,
    filterTVShows,
  };
}
