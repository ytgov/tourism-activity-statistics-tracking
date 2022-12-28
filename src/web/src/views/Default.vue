<template>
  <div class="home">
    <h1>Default</h1>
    <Dashboard />
  </div>
</template>
<script lang="ts"> 

import Dashboard from "@/modules/home/views/Dashboard.vue";
export default {
  name: "Default",
  components: {
     Dashboard
  },
};

</script>
