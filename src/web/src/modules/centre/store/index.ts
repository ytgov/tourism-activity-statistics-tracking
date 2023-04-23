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
  reportToken: string;
  metabaseUrl: string;
}

export const useCentreStore = defineStore("centre", {
  state: (): CentreState => ({
    selectedSite: undefined,
    selectedDate: makeDateOptions()[0],
    //dateOptions: makeDateOptions(),
    siteToSelect: 0,
    manageSites: new Array<VisitorCentre>(),
    reportToken: "",
    metabaseUrl: "",
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
    async initialize() {
      console.log("Initialized Centre store.");
      await this.loadReportToken();
    },
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

          if (this.selectedSite) {
            const index = this.manageSites.map((s) => s.id).indexOf(this.selectedSite.id);
            if (index !== -1) {
              this.manageSites.splice(index, 1, this.selectedSite);
            }
          }
        });

      m.notify({ variant: "success", text: "Saved" });
    },

    add(originName: string, date: string, amount: number) {
      if (this.selectedSite) {
        let origin = this.selectedSite.origins.filter((o) => o.name == originName)[0];

        origin;
      }
    },

    async loadDailyStats(ids: number[]) {
      const api = useApiStore();

      this.manageSites = new Array<VisitorCentre>();

      for (let id of ids) {
        await api.secureCall("get", `${VISITORCENTRE_URL}/${id}/stats`).then((resp) => {
          const index = this.manageSites.map((s) => s.id).indexOf(id);
          if (index !== -1) {
            this.manageSites.splice(index, 1, resp.data);
          } else this.manageSites.push(resp.data);
        });
      }
    },
    selectFirstToManage() {
      if (this.manageSites && this.manageSites.length > 0) {
        this.selectedSite = this.manageSites[0];

        if (this.selectedSite && this.selectedSite.days) {
          this.selectedDate = this.selectedSite.days[0];
        }
      }
    },
    loadReportToken() {
      const api = useApiStore();

      api.secureCall("get", `${VISITORCENTRE_URL}/token`).then((resp) => {
        this.reportToken = resp.data.token;
        this.metabaseUrl = resp.data.metabase_url;
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

  days?: any[];
}

export interface VisitorOrigin {
  name: string;
  dailyTotal: number;
  weeklyTotal: number;
}
