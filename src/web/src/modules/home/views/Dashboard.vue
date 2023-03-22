<template>
  <div v-if="dataEntrySites.length > 0">
    <data-entry></data-entry>
  </div>
  <div v-else>You don't have any data entry sites defined.</div>
</template>

<script lang="ts">
import DataEntry from "@/modules/centre/components/DataEntry.vue";
import { useUserStore } from "@/store/UserStore";
import { mapState } from "pinia";
export default {
  name: "Dashboard",
  components: { DataEntry },
  computed: {
    ...mapState(useUserStore, ["user", "dataEntrySites"]),
  },
};
</script>
