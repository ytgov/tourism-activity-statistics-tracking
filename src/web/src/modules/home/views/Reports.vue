<template>
  <h1 class="text-h5 mb-5">Reports</h1>

  <!--  <v-row>
    <v-col cols="7">
      <v-card class="mb-5">
        <v-card-text>
          <h4 class="text-h6">Visitiors by Month</h4>
        </v-card-text>
        <MonthChart></MonthChart>
      </v-card>
    </v-col>

    <v-col cols="5">
      <v-card class="mb-5">
        <v-card-text> <h4 class="text-h6">Visitors by Day of Week</h4> </v-card-text>
        <DayOfWeekChart></DayOfWeekChart>
      </v-card>
    </v-col>
    <v-col cols="5">
      <v-card class="mb-5">
        <v-card-text>
          <h4 class="text-h6">Visitors by Time of Day</h4>
        </v-card-text>

        <TimeOfDayChart></TimeOfDayChart>
      </v-card>
    </v-col>
    <v-col cols="7">
      <v-card class="mb-5">
        <v-card-text> <h4 class="text-h6">Visitors by Year</h4> </v-card-text>
        <YearChart></YearChart>
      </v-card>
    </v-col>
  </v-row> -->

  <iframe :src="iframeUrl" frameborder="0" style="width: 100%" height="100%" allowtransparency></iframe>
</template>

<script lang="ts">
import TimeOfDayChart from "@/modules/charts/TimeOfDayChart.vue";
import DayOfWeekChart from "@/modules/charts/DayOfWeekChart.vue";
import MonthChart from "@/modules/charts/MonthChart.vue";
import YearChart from "@/modules/charts/YearChart.vue";

import { mapState } from "pinia";
import { useCentreStore } from "@/modules/centre/store";

export default {
  name: "Dashboard",
  components: { TimeOfDayChart, DayOfWeekChart, MonthChart, YearChart },
  data: () => ({
    token: "",
  }),
  mounted() {},
  computed: {
    ...mapState(useCentreStore, ["reportToken", "metabaseUrl"]),

    iframeUrl() {
      return this.metabaseUrl + "/embed/dashboard/" + this.reportToken + "#bordered=true&titled=true";
    },
  },
  methods: {},
};
</script>
