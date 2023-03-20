<template>

<p> SITE: {{ user.primary_site }}</p>

{{ user.scopes }}
<br>
SITES:
{{ dataEntrySites }}

  <data-entry></data-entry>
</template>

<script lang="ts">
import DataEntry from "@/modules/centre/components/DataEntry.vue";
import { useUserStore } from "@/store/UserStore";
import { mapState } from "pinia";
export default {
  name: "Dashboard",
  components: { DataEntry },
  computed: {
    ...mapState(useUserStore, ["user", "dataEntrySites"])
  }
};
</script>
