<template>
  <div class="d-flex justify-space-between">
    <h1 class="text-h5 mb-5">Daily Data Entry</h1>

    <div>
      <v-switch
        v-model="entryMode"
        label="Direct Input"
        color="primary"
        inset
      ></v-switch>
    </div>
  </div>

  <template v-if="entryMode">
    <BulkDataEntryCard />
  </template>
  <template v-else>
    <IncrementalDataEntryCard />
  </template>
</template>

<script lang="ts">
import IncrementalDataEntryCard from "./IncrementalDataEntryCard";
import BulkDataEntryCard from "./BulkDataEntryCard";

export default {
  name: "DataEntry",
  components: {
    IncrementalDataEntryCard,
    BulkDataEntryCard,
  },
  data () {
    return {
      entryMode: true,
    }
  },
}
</script>

<style scoped>

</style>
