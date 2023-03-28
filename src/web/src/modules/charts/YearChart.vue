<template>
  <VueApexCharts width="100%" type="bar" height="250" :options="chartOptions" :series="chartSeries"></VueApexCharts>
</template>

<script lang="ts">
import VueApexCharts from "vue3-apexcharts";
export default {
  name: "Dashboard",
  components: { VueApexCharts },
  data: () => ({
    chartOptions: {
      chart: {
        id: "vuechart-example",
      },
      xaxis: {
        categories: ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
      },
    },
    chartSeries: [
      {
        name: "Enrollment",
        color: "#DC4405",
        data: [65154, 67224, 70153, 73541, 77584, 31516, 30941, 48456, 79581],
      },
    ],
  }),
};
</script>
