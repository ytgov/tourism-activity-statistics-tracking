import Vue from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "./store";
import "./plugins/base";
import axios from "axios";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

axios.defaults.withCredentials = true;

import { Auth0Plugin } from '@/auth/auth0-plugin';

Vue.use(Auth0Plugin, {
  onRedirectCallback: (appState) => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname,
    );
  },
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
