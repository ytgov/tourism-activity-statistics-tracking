import { defineStore } from "pinia";
import { uniq } from "lodash";

import { useNotificationStore } from "@/store/NotificationStore";
import { useApiStore } from "@/store/ApiStore";
import { PERMISSION_URL, PROFILE_URL } from "@/urls";

let m = useNotificationStore();

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
    },
    permissions: [],
    myCentres: [],
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
        let sites = [];

        for (let scope of state.user.scopes) {
          console.log("SCOPE", scope);

          if (scope.startsWith("VIC.")) {
            let name = scope.replace(/^VIC./, "");
            name = name.replace(/.Manage$/, "");
            name = name.replace(/.Write$/, "");

            sites.push(name);
          }
        }

        return uniq(sites);
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

    async getRoles() {
      console.log("getting roles");

      let api = useApiStore();
      api.secureCall("get", PROFILE_URL);
    },
    canDo(action: string): Boolean {
      console.log("CURRENT USER CAN DO ", this.user.scopes);

      return true;
    },
  },
});
