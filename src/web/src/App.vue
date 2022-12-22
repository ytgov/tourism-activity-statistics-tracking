<template>
  <v-app>
    <Layout />
    <router-view />
  </v-app>
</template>

<script>
import Layout from "@/layouts/Layout.vue";

export default {
  name: "App",
  components: { Layout }
};
</script>
