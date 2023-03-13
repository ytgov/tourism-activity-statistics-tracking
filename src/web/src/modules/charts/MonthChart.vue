<template>
  <VueApexCharts width="100%" type="area" height="250" :options="chartOptions" :series="chartSeries"></VueApexCharts>
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
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
      yxaxis: {
        labels: false
      },
            stroke: {
              curve: 'smooth'
            },
    },
    chartSeries: [
      {
        name: "Whitehorse VIC",
        color: "#DC4405",
        data: [16, 27, 25, 50, 66, 79, 87, 91, 77, 53, 77, 53],
      },
      {
        name: "Dawson City VIC",
        color: "#F2A900",
        data: [0, 0, 15, 19, 24, 38, 50, 48, 38, 24, 0, 0],
      },
      {
        name: "Watson Lake VIC",
        color: "#24405A",
        data: [0, 0, 8, 7, 19, 27, 47, 39, 34, 0, 0, 0],
      },
    ],
  }),
};
</script>
