import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createAuth0 } from "@auth0/auth0-vue";
import "./assets/tailwind.css";

createApp(App)
  .use(
    createAuth0({
      domain: "dev-5kka4xecei7l5xpu.us.auth0.com",
      clientId: "sn0k6pX9wC5wkmQ3v8bUHLou8hlVkdxv",
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    })
  )
  .use(router)
  .mount("#app");
