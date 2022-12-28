import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { md2 } from "vuetify/blueprints";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import router from "./routes";

const vuetify = createVuetify({
  components,
  directives,
  blueprint: md2,
});

const app = createApp(App);

app.use(vuetify);
app.use(router);
app.component("DefaultLayout", () => {
  return import("./layout/DefaultLayout.vue");
});

app.mount("#app");
