import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import { router } from "./routes";

import { domain, client_id, audience } from "../auth-config.json";

// Plugins
import { registerPlugins } from "./plugins";
import { createAuth0 } from "@auth0/auth0-vue";

const pinia = createPinia();

const auth = createAuth0({
  domain: domain,
  clientId: client_id,
  authorizationParams: {
    audience,
    redirect_uri: window.location.origin,
  },
});

const app = createApp(App);
app
  .use(pinia)
  .use(router)
  .use(auth as any);

registerPlugins(app);

app.mount("#app");
