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
    IncrementalDataEntryCard
    <IncrementalDataEntryCard />
  </template>
  <template v-else>
    BulkDataEntryCard
    <BulkDataEntryCard />
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
      entryMode: false,
    }
  },
}
</script>

<style scoped>

</style>
