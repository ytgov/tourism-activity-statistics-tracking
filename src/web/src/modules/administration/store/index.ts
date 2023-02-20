import { defineStore } from "pinia";
import { cloneDeep } from "lodash";

import { useNotificationStore } from "@/store/NotificationStore";
import { useApiStore } from "@/store/ApiStore";
import { PROFILE_URL, USERS_URL, VISITORCENTRE_URL } from "@/urls";
import { AppUser, VisitorCentre } from "@/store/models";

let m = useNotificationStore();

interface AdminState {
  users: Array<AppUser>;
  selectedUser: AppUser | undefined;
  isLoading: Boolean;
  centres: VisitorCentre[];
  selectedCentre: VisitorCentre | undefined;
}

export const useAdminStore = defineStore("admin", {
  state: (): AdminState => ({
    users: [],
    isLoading: false,
    selectedUser: undefined,
    centres: [],
    selectedCentre: undefined,
  }),
  getters: {
    userCount(state) {
      return state.users.length;
    },
  },
  actions: {
    async getAllUsers() {
      this.isLoading = true;
      let api = useApiStore();
      await api
        .secureCall("get", USERS_URL)
        .then((resp) => {
          this.users = resp.data;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async getRoles() {
      let api = useApiStore();
      api.secureCall("get", PROFILE_URL);
    },
    selectUser(user: any) {
      this.selectedUser = user;
    },
    unselectUser() {
      this.selectedUser = undefined;
    },
    async save() {
      this.isLoading = true;
      let api = useApiStore();

      if (this.selectedUser) {
        await api
          .secureCall("put", `${USERS_URL}/${this.selectedUser.email}`, this.selectedUser)
          .then((resp) => {
            this.users = resp.data;
          })
          .finally(() => {
            this.isLoading = false;
          });

        m.notify({ text: "User saved", variant: "success" });
        this.getAllUsers();
      }
    },

    async getAllCentres() {
      this.isLoading = true;
      let api = useApiStore();
      await api
        .secureCall("get", VISITORCENTRE_URL)
        .then((resp) => {
          this.centres = resp.data;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    selectCentre(centre: any) {
      this.selectedCentre = cloneDeep(centre);
    },
    unselectCentre() {
      this.selectedCentre = undefined;
    },
    async saveCentre() {
      let api = useApiStore();
      this.isLoading = true;

      if (this.selectedCentre) {
        if (this.selectedCentre.id) {
          await api
            .secureCall("put", `${VISITORCENTRE_URL}/${this.selectedCentre.id}`, this.selectedCentre)
            .then((resp) => {
              m.notify({ text: "Visitor Centre saved", variant: "success" });
              this.getAllCentres();
            })
            .finally(() => {
              this.unselectCentre();
              this.isLoading = false;
            });
        } else {
          await api
            .secureCall("post", `${VISITORCENTRE_URL}`, this.selectedCentre)
            .then((resp) => {
              m.notify({ text: "Visitor Centre saved", variant: "success" });
              this.getAllCentres();
            })
            .finally(() => {
              this.unselectCentre();
              this.isLoading = false;
            });
        }
      }
    },
  },
});
