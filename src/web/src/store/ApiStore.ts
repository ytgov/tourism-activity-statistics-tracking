import { defineStore, acceptHMRUpdate } from "pinia";
import { useNotificationStore } from "@/store/NotificationStore";
import { useAuth0 } from "@auth0/auth0-vue";
import api from "./helpers/axiosAPIConfig";

//refs are reactive variables
//computed are reactive variables that are derived from other reactive variables
// functions are equivalent to methods/actions in vue2

export const useApiStore = defineStore("api", () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const m = useNotificationStore();

  function doApiErrorMessage(err) {
    let status_code = 500;
    if (err.response) {
      status_code = err.response.status || 500;
    }

    let message = {
      status_code: status_code,
      text: `${err.message}`, // ${err.response.statusText}`,
      icon: "mdi-error",
      variant: "error",
    };
    m.notify(message);
  }

  async function secureCall(method, url) {
    let response;
    if (!isAuthenticated.value) {
      console.log("Not Authenticated");
      response = { error: "Not Authenticated" };
      return;
    }
    response = await getAccessTokenSilently().then(async (token) => {
      return await api(method, token)
        .request(url)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          doApiErrorMessage(err);
          return { error: err };
        });
    });

    return response;
  }
  async function call(method, url) {
    let response;

    response = await api(method, token)
      .request(url)
      .then((res) => {
        console.log(res);
        return res.data;
      })
      .catch((err) => {
        doApiErrorMessage(err);
        return { error: err };
      });
  }
  return {
    secureCall,
    call,
  };
});

// hot reloading for this store
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useApiStore, import.meta.hot));
}
