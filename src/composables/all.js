import axios, { all } from "axios";
import { ref } from "vue";

export default function useAllTrending() {
  const allTrending = ref([]);
  const upcomingMovies = ref([]);
  const upcomingTVShows = ref([]);
  const query = ref("");
  const isAllTrendingFetching = ref(false);

  const showAllTrending = async (resultsCount = null, timeWindow = "day") => {
    isAllTrendingFetching.value = true;
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/trending/all/${timeWindow}?api_key=9ba3f19378eba6cb60a5fd7e3b960569&`
      );
      const allResults = await response.data.results;
      const filteredResults = allResults.filter(
        (result) => result.media_type === "movie" || result.media_type === "tv"
      );
      allTrending.value = resultsCount
        ? filteredResults.slice(0, resultsCount)
        : filteredResults;
    } catch (error) {
      console.error("Error fetching trending shows", error);
    } finally {
      isAllTrendingFetching.value = false;
    }
  };

  const showUpcomingMovies = async (resultsCount = null) => {
    const date = new Date();
    const year = date.getFullYear();
    const dateToday = date.toISOString().split("T")[0];
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?vote_count.gte=100&with_release_type=2|3&release_date.gte=${dateToday}&release_date.lte=${
        year + 1
      }-01-01&primary_release_year=${year}&api_key=9ba3f19378eba6cb60a5fd7e3b960569`
    );
    const allResults = await response.data.results;
    upcomingMovies.value = resultsCount
      ? allResults.slice(0, resultsCount)
      : allResults;
  };

  const showUpcomingTVShows = async (resultsCount = null) => {
    const date = new Date();
    const year = date.getFullYear();
    const dateToday = date.toISOString().split("T")[0];
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/tv?vote_count.gte=100&with_release_type=2|3&release_date.gte=${dateToday}&release_date.lte=${
        year + 1
      }-01-01&primary_release_year=${year}&api_key=9ba3f19378eba6cb60a5fd7e3b960569`
    );
    const allResults = await response.data.results;
    upcomingTVShows.value = resultsCount
      ? allResults.slice(0, resultsCount)
      : allResults;
  };

  const setQuery = (value) => {
    query.value = value;
  };

  return {
    allTrending,
    upcomingMovies,
    upcomingTVShows,
    query,
    isAllTrendingFetching,
    showUpcomingMovies,
    showAllTrending,
    showUpcomingTVShows,
    setQuery,
  };
}
