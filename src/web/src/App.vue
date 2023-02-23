<template>
  <v-app>
    <router-view />
    <notifications />
  </v-app>
</template>

<script lang="ts">
import Notifications from "@/components/Notifications.vue";
import { useApiStore } from "@/store/ApiStore";

const api = useApiStore();

export default {
  data: function () {
    return {};
  },
  components: {
    Notifications,
  },
};
</script>
