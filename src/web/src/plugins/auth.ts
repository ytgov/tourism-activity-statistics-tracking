import { createAuth0 } from "@auth0/auth0-vue";
import { development, production } from "../../auth-config.json";

// The "@auth0/auth0-vue" library composables to load and manage
// authentication information.  In components this information is available
// via this.$auth0.

// However the same auth information is not available to Pinia stores becuase
// of the way that composables work.  So, the authStore loads in @/App.vue to
// work around this issue.

let authConfig = production;

if (process.env.NODE_ENV == "development") authConfig = development;

export const AuthHelper = createAuth0({
  domain: authConfig.domain,
  clientId: authConfig.client_id,
  authorizationParams: {
    audience: authConfig.audience,
    redirect_uri: window.location.origin,
  },
  // Uncomment the following line to use the config from .env file
  // redirect_uri: REDIRECT_URI,
});
