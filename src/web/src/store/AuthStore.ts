import { defineStore, acceptHMRUpdate } from "pinia";
import { computed, ref } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
import api from "./helpers/axiosAPIConfig";

//refs are reactive variables
//computed are reactive variables that are derived from other reactive variables
// functions are equivalent to methods/actions in vue2

export const useAuthStore = defineStore("auth", () => {
  // these all come back as reactive but not as refs - I dont think that matters....
  // but it could come back to bite you if some part if reactivity isn't working
  // expected.
  const { user, idTokenClaims, isAuthenticated, isLoading } = useAuth0();

  return {
    user,
    isLoading,
    isAuthenticated,
  };
});
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
