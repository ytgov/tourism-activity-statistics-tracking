import { defineStore } from "pinia";
import { uniq } from "lodash";

import { useNotificationStore } from "@/store/NotificationStore";
import { useApiStore } from "@/store/ApiStore";
import { PERMISSION_URL, PROFILE_URL } from "@/urls";
import { useCentreStore } from "@/modules/centre/store";

let m = useNotificationStore();
let c = useCentreStore();

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
        return [
          {
            id: 1,
            name: "Whitehorse VIC",
            origins: [
              { name: "Yukon", dailyTotal: 0, weeklyTotal: 0, delta: 0 },
              { name: "British Columbia", dailyTotal: 0, weeklyTotal: 0, delta: 0 },
              { name: "Other Canada", dailyTotal: 0, weeklyTotal: 0, delta: 0 },
              { name: "American", dailyTotal: 0, weeklyTotal: 0, delta: 0 },
              { name: "International", dailyTotal: 0, weeklyTotal: 0, delta: 0 },
              { name: "Unknown", dailyTotal: 0, weeklyTotal: 0, delta: 0 },
            ],
          },
          {
            id: 4,
            name: "Carcross VIC",
            origins: [
              { name: "Yukon", dailyTotal: 0, weeklyTotal: 0, delta: 0 },
              { name: "British Columbia", dailyTotal: 0, weeklyTotal: 0, delta: 0 },
              { name: "Other Canada", dailyTotal: 0, weeklyTotal: 0, delta: 0 },
            ],
          },
        ];
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

        if (this.user.primary_site) {
          c.selectSiteById(this.user.primary_site);
        }
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
