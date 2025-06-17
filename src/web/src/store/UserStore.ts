import { defineStore } from "pinia";
import { useApiStore } from "@/store/ApiStore";
import { PERMISSION_URL, PROFILE_URL } from "@/urls";
import { UserScope } from "./models";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: {
      display_name: "",
      first_name: "",
      last_name: "",
      email: "",
      roles: [""],
      ynet_id: "",
      is_admin: false,
      scopes: new Array<string>(),
      primary_site: -1,
    },
    permissions: [],
  }),
  getters: {
    userRoles(state) {
      return state.user.roles;
    },
    isAdmin(state) {
      return state.user.is_admin;
    },
    dataEntrySites(state) {
      if (state.user && state.user.scopes) {
        let inputScopes = state.user.scopes
          .map((s: string | UserScope) => (typeof s == "string" ? s : s.name))
          .filter((s: string) => {
            return s.startsWith("VIC.INPUT_");
          });

        return inputScopes.map((s: string) => parseInt(s.replace("VIC.INPUT_", "")));
      }
      return [];
    },
  },
  actions: {
    async initialize() {
      //console.log("Initializing user store...");

      await this.loadCurrentUser();
      await this.loadPermissions();

      console.log("Initialized user store");
    },
    async loadCurrentUser() {
      let api = useApiStore();
      await api.secureCall("get", PROFILE_URL).then((resp) => {
        this.user = resp.data;
      });
    },
    async loadPermissions() {
      let api = useApiStore();
      await api.secureCall("get", PERMISSION_URL).then((resp) => {
        this.permissions = resp.data.scopes;
      });
    },

    canDo(action: string): Boolean {
      console.log("CURRENT USER CAN DO ", this.user.scopes);

      return true;
    },
  },
});
