import { defineStore } from "pinia";
import { cloneDeep } from "lodash";

import { useNotificationStore } from "@/store/NotificationStore";
import { useApiStore } from "@/store/ApiStore";
import { KIOSKDATA_URL, PROFILE_URL, USERS_URL, VISITORCENTRE_URL } from "@/urls";
import { AppUser, VisitorCentre } from "@/store/models";

let m = useNotificationStore();

interface AdminState {
  users: Array<AppUser>;
  selectedUser: AppUser | undefined;
  isLoading: boolean;
  centres: VisitorCentre[];
  selectedCentre: VisitorCentre | undefined;
  kiosks: any[];
  selectedKiosk: any | undefined;
}

export const useAdminStore = defineStore("admin", {
  state: (): AdminState => ({
    users: [],
    isLoading: false,
    selectedUser: undefined,
    centres: [],
    selectedCentre: undefined,
    kiosks: [],
    selectedKiosk: undefined,
  }),
  getters: {
    userCount(state) {
      return state.users.length;
    },
    activeCentres(state) {
      return state.centres.filter((c) => c.is_active);
    },
  },
  actions: {
    async initialize() {
      //console.log("Initializing Admin store...");
      await this.getAllCentres();
      console.log("Initialized Admin store.");
    },

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
            this.unselectUser();
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

    async getAllKiosks() {
      this.isLoading = true;
      let api = useApiStore();

      await api
        .secureCall("get", KIOSKDATA_URL)
        .then((resp) => {
          this.kiosks = resp.data;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    selectKiosk(kiosk: any) {
      this.selectedKiosk = cloneDeep(kiosk);
    },
    unselectKiosk() {
      this.selectedKiosk = undefined;
    },
    async saveKiosk() {
      let api = useApiStore();
      this.isLoading = true;

      if (this.selectedKiosk) {
        await api
          .secureCall("post", `${KIOSKDATA_URL}`, this.selectedKiosk)
          .then((resp) => {
            m.notify({ text: "Kiosk saved", variant: "success" });
            this.getAllKiosks();
          })
          .finally(() => {
            this.unselectKiosk();
            this.isLoading = false;
          });
      }
    },
    async deleteKiosk(kiosk: any) {
      let api = useApiStore();
      this.isLoading = true;

      await api
        .secureCall("delete", `${KIOSKDATA_URL}/${kiosk.playout_id}`)
        .then((resp) => {
          m.notify({ text: "Kiosk saved", variant: "success" });
          this.getAllKiosks();
        })
        .finally(() => {
          if (this.selectedKiosk.items.length == 0) this.unselectKiosk();
          this.isLoading = false;
        });
    },
  },
});
