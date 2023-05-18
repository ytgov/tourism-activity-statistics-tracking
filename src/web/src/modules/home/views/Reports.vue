<template>
  <h1 class="text-h5 mb-5">Reports</h1>

  <v-card style="width: 100%; height: calc(100% - 70px)">
    <v-progress-linear :indeterminate="iFrameLoading" :active="iFrameLoading" color="primary"></v-progress-linear>

    <iframe id="iframe" :src="iframeUrl" frameborder="0" style="width: 100%" height="100%" allowtransparency></iframe>
  </v-card>
</template>

<script lang="ts">
import TimeOfDayChart from "@/modules/charts/TimeOfDayChart.vue";
import DayOfWeekChart from "@/modules/charts/DayOfWeekChart.vue";
import MonthChart from "@/modules/charts/MonthChart.vue";
import YearChart from "@/modules/charts/YearChart.vue";

import { mapActions, mapState } from "pinia";
import { useCentreStore } from "@/modules/centre/store";

export default {
  name: "Dashboard",
  components: { TimeOfDayChart, DayOfWeekChart, MonthChart, YearChart },
  data: () => ({
    token: "",
    iFrameLoading: true,
  }),
  async mounted() {
    await this.loadReportToken();

    const iframeEle = document.getElementById("iframe");

    let that = this;

    if (iframeEle) {
      iframeEle.addEventListener("load", function () {
        // Hide the loading indicator
        that.iFrameLoading = false;
      });
    }
  },
  computed: {
    ...mapState(useCentreStore, ["reportToken", "metabaseUrl"]),

    iframeUrl() {
      return (
        this.metabaseUrl + "/embed/dashboard/" + this.reportToken + "#theme=transparent&bordered=false&titled=false"
      );
    },
  },
  methods: {
    ...mapActions(useCentreStore, ["loadReportToken"]),
  },
};
</script>
<style></style>
