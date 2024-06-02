import { ref } from "vue";
import axios from "axios";

export default function useFilterAll() {
  const searchResults = ref([]);
  const isFilterFetching = ref(false);
  const sortedAllAtoZ = ref([]);
  const prevPage = ref(null);
  const currentPage = ref(0);
  const nextPage = ref(null);
  const totalPages = ref(500);

  const makePagination = (page, totalPages) => {
    currentPage.value = page;
    prevPage.value = page > 1 ? page - 1 : null;
    nextPage.value = page < totalPages ? page + 1 : null;
  };

  const setSearchResults = async (s, type = null, y = null, page = null) => {
    isFilterFetching.value = true;
    try {
      const response = await axios.get(
        `http://www.omdbapi.com/?apikey=f6259449&s=${s}&type=${type}&y=${y}&page=${page}`
      );
      const results = response.data.Search;
      searchResults.value = results || [];
    } catch (error) {
      console.error("Failed to fetch movie or tv show", error);
    } finally {
      isFilterFetching.value = false;
    }
  };

  const setSortedAllAtoZ = async (page = 1) => {
    try {
      isFilterFetching.value = true;
      const movieResponse = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=9ba3f19378eba6cb60a5fd7e3b960569&sort_by=title.asc&vote_count.gte=280&page=${page}`
      );
      const tvShowResponse = await axios.get(
        `https://api.themoviedb.org/3/discover/tv?api_key=9ba3f19378eba6cb60a5fd7e3b960569&sort_by=name.asc&vote_count.gte=280&page=${page}`
      );
      const movieResults = await movieResponse.data.results;
      const tvShowResults = await tvShowResponse.data.results;
      const mergedResults = [...movieResults, ...tvShowResults];
      const sortedResults = mergedResults.sort((a, b) => {
        if (a.original_name && b.original_name) {
          return a.original_name.localeCompare(b.original_name);
        } else if (a.original_title && b.original_title) {
          return a.original_title.localeCompare(b.original_title);
        } else if (a.original_name && b.original_title) {
          return a.original_name.localeCompare(b.original_title);
        } else if (a.original_title && b.original_name) {
          return a.original_title.localeCompare(b.original_name);
        } else {
          return 0;
        }
      });
      sortedAllAtoZ.value = sortedResults;

      makePagination(movieResponse.data.page, totalPages.value);
      makePagination(tvShowResponse.data.page, totalPages.value);
    } catch (error) {
      console.error("Failed to fetch sorted A-Z movies or tv shows", error);
    } finally {
      isFilterFetching.value = false;
    }
  };

  return {
    prevPage,
    currentPage,
    nextPage,
    totalPages,
    searchResults,
    isFilterFetching,
    sortedAllAtoZ,
    setSortedAllAtoZ,
    setSearchResults,
  };
}
