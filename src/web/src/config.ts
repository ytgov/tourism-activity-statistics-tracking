export const NODE_ENV = process.env.NODE_ENV || "development";

let path;
switch (process.env.NODE_ENV) {
  case "production":
    path = `../.env.production`;
    break;
  default:
    path = `../.env.development`;
}

// Note - these enviroment variables are not available to Github at build time
// so usually grab them from the server at runtime or store them in a local
// JSON file

export const apiConfigUrl = process.env.NODE_ENV == "production" ? "/api/config" : "http://localhost:3000/api/config";

export const AUTH_DOMAIN = import.meta.env.VITE_AUTH_DOMAIN;
export const AUTH_CLIENT_ID = import.meta.env.VITE_AUTH_CLIENT_ID;
export const AUTH_AUDIENCE = import.meta.env.VITE_AUTH_AUDIENCE;

// Generally we use window.location.origin for the redirect_uri but if
// you may want to use a different URL for the redirect_uri. Make sure you
// make the related changes in @/config.js and @/plugins/auth.js

//export const AUTH_REDIRECT_URI = import.meta.env.VITE_AUTH_REDIRECT_URI;

export const environment = process.env.NODE_ENV;
export const apiBaseUrl = process.env.NODE_ENV == "production" ? "" : "http://localhost:3000";
export const applicationUrl = process.env.VUE_APP_FRONTEND_URL || "http://localhost:8080";

export const applicationName = "Vue 3 Template";
export const applicationIcon = "mdi-leaf";
export const hasSidebar = true;
export const hasSidebarClosable = false;
