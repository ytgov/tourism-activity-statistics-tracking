<script setup lang="ts">
import Notifications from "@/components/Notifications.vue";

import { useAuthStore } from "@/store/AuthStore";
import { useApiStore } from "@/store/ApiStore";

components: {
  Notifications;
}

const auth = useAuthStore();
const api = useApiStore();
</script>

<template>
  <v-app>
    <router-view />
    <notifications />
  </v-app>
</template>
