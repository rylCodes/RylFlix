import { createRouter, createWebHistory } from "vue-router";
import IntroductionView from "../views/IntroductionView.vue";
const routes = [
  {
    path: "/",
    name: "Introduction",
    component: IntroductionView,
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/filter",
    name: "Filter",
    component: () => import("../views/SearchResultsView.vue"),
    props: true,
  },
  {
    path: "/filter/a-z/",
    name: "A-Z",
    component: () => import("../views/SortedAtoZView.vue"),
    props: (route) => ({ page: route.query.page }),
  },
  {
    path: "/movies/",
    name: "Movies",
    component: () => import("../views/MoviesView.vue"),
    props: (route) => ({ page: route.query.page }),
  },
  {
    path: "/tvshows/",
    name: "TVShows",
    component: () => import("../views/TvShowsView.vue"),
    props: (route) => ({ page: route.query.page }),
  },
  {
    path: "/movie/:id/:title",
    name: "ShowMovie",
    component: () => import("../views/ShowMovie.vue"),
    props: true,
  },
  {
    path: "/tvshow/:id/:title",
    name: "ShowTVShow",
    component: () => import("../views/ShowTVShow.vue"),
    props: true,
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/AboutView.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/:user/watchlist",
    name: "WatchList",
    component: () => import("../views/WatchListView.vue"),
    props: true,
  },
  {
    path: "/:user/favorite",
    name: "Favorite",
    component: () => import("../views/FavoriteView.vue"),
    props: true,
  },
  {
    path: "/:user/ratings",
    name: "Ratings",
    component: () => import("../views/RatingsView.vue"),
    props: true,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
