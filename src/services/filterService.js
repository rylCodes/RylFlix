import { ref } from "vue";

export default function useFilterService() {
  const isMovieTypeSelected = ref(false);
  const isTvTypeSelected = ref(false);

  const setIsMovieTypeSelected = () => {
    isMovieTypeSelected.value = !isMovieTypeSelected.value;
  };

  const setIsTvTypeSelected = () => {
    isTvTypeSelected.value = !isTvTypeSelected.value;
  };

  return {
    isMovieTypeSelected,
    isTvTypeSelected,
    setIsMovieTypeSelected,
    setIsTvTypeSelected,
  };
}
