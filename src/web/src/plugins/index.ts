/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

import { loadFonts } from "./webfontloader";
import BaseComponents from "./baseComponents";
import { Auth0Plugin } from "./auth";
import vuetify from "./vuetify";
import { App } from "vue";

export function registerPlugins(app: App<Element>) {
  loadFonts();
  BaseComponents.register(app);
  app.use(vuetify);
  app.use(Auth0Plugin);
}
