<template>
  <v-app>
    <router-view />
    <notifications />
  </v-app>
</template>

<script lang="ts">
import Notifications from "@/components/Notifications.vue";

export default {
  data: function () {
    return {};
  },
  components: {
    Notifications,
  },
};
</script>
