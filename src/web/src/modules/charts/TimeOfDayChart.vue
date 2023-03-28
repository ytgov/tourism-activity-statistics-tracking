<template>
  <VueApexCharts width="100%" type="line" height="250" :options="chartOptions" :series="chartSeries"></VueApexCharts>
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
        categories: ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
      },
            stroke: {
              curve: 'smooth'
            },
    },
    chartSeries: [
      {
        name: "Enrollment",
        color: "#7A9A01",
        data: [16, 27, 25, 50, 66, 79, 87, 91, 77, 53],
      },
    ],
  }),
};
</script>
