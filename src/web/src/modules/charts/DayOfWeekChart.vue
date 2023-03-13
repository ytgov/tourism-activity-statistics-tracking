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
        categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      },
    },
    chartSeries: [
      {
        name: "Enrollment",
        color: "#24405A",
        data: [184, 134, 111, 90, 127, 199, 247],
      },
    ],
  }),
};
</script>
