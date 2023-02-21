import { defineStore } from "pinia";

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
      scopes: [],
    },
    permissions: [],
    myCentres: []
  }),
  getters: {
    userRoles(state) {
      return state.user.roles;
    },
    isAdmin(state) {
      return state.user.roles.includes("System Administrator");
    },
  },
  actions: {
    async initialize() {
      //console.log("Initializing user store...");

      await this.loadCurrentUser();
      await this.loadPermissions();

      console.log("Initialized user store");
    },
    toggleAdmin() {
      if (this.isAdmin) {
        this.user.roles = this.user.roles.filter((role) => role !== "System Administrator");
        this.user.roles.push("User");
      } else {
        this.user.roles = this.user.roles.filter((role) => role !== "User");
        this.user.roles.push("System Administrator");
      }

      let message = {
        status_code: 200,
        text: "Changed role to " + this.user.roles,
        icon: "mdi-information",
        variant: "success",
      };
      m.notify(message);
    },
    async loadCurrentUser() {
      let api = useApiStore();
      await api.secureCall("get", PROFILE_URL).then((resp) => {
        this.user = resp.data;
        this.user.roles = [];
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
    canDo(action:string): Boolean {
      console.log("CURRENT USER CAN DO ", this.user.scope)

      return true;

    }
  },
});
