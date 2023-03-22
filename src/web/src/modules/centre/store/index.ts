import { defineStore } from "pinia";
import moment from "moment";
import { useNotificationStore } from "@/store/NotificationStore";
import { useApiStore } from "@/store/ApiStore";
import { VISITORCENTRE_URL } from "@/urls";

let m = useNotificationStore();

interface CentreState {
  selectedSite: VisitorCentre | undefined;
  selectedDate: any;
  //dateOptions: string[];
  siteToSelect: number;
  manageSites: VisitorCentre[];
}

export const useCentreStore = defineStore("centre", {
  state: (): CentreState => ({
    selectedSite: undefined,
    selectedDate: makeDateOptions()[0],
    //dateOptions: makeDateOptions(),
    siteToSelect: 0,
    manageSites: new Array<VisitorCentre>(),
  }),
  getters: {
    dateOptions() {
      if (this.selectedSite) {
        let site = this.selectedSite as any;
        return site.days;
      }
      return [];
    },
  },
  actions: {
    selectSite(user: any) {
      this.selectedSite = user;
    },
    selectSiteById(id: number) {
      this.siteToSelect = id;
    },
    unselectSite() {
      this.selectedSite = undefined;
    },
    async save() {
      const api = useApiStore();

      api
        .secureCall("put", `${VISITORCENTRE_URL}/record-stats`, {
          date: this.selectedDate,
          site: this.selectedSite,
          recorded_at: moment().utc(true).toDate(),
        })
        .then((resp) => {
          this.selectedSite = resp.data;
          let currentDate = this.selectedDate.date;
          let day = resp.data.days.filter((f: any) => f.date == currentDate)[0];
          this.selectedDate = day;
        });

      m.notify({ variant: "success", text: "Saved" });
    },

    add(originName: string, date: string, amount: number) {
      if (this.selectedSite) {
        let origin = this.selectedSite.origins.filter((o) => o.name == originName)[0];

        origin;
      }
    },

    async loadDailyStats(id: number) {
      const api = useApiStore();

      await api.secureCall("get", `${VISITORCENTRE_URL}/${id}/stats`).then((resp) => {
        const index = this.manageSites.map((s) => s.id).indexOf(id);
        if (index !== -1) {
          this.manageSites.splice(index, 1, resp.data);
        } else this.manageSites.push(resp.data);
      });
    },
  },
});

function makeDateOptions(): string[] {
  let date = moment();
  let options = [date.format("YYYY-MM-DD")];

  for (let i = 0; i < 11; i++) {
    options.push(date.add(-1, "days").format("YYYY-MM-DD"));
  }

  return options;
}

export interface VisitorCentre {
  id: number;
  name: string;
  origins: VisitorOrigin[];
}

export interface VisitorOrigin {
  name: string;
  dailyTotal: number;
  weeklyTotal: number;
}
