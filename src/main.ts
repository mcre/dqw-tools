/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Plugins
import { registerPlugins } from "@/plugins";

const app = createApp(App);

registerPlugins(app);

import VueGtag from "vue-gtag-next";
if (process.env.NODE_ENV === "production") {
  app.use(VueGtag, {
    property: {
      id: "G-PQ3NGWW328",
    },
  });
}

app.mount("#app");
