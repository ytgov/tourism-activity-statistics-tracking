<template>
  <div class="d-flex justify-space-between">
    <h1 class="text-h5 mb-5">Daily Data Entry</h1>

    <div>
      <v-switch
        v-model="entryMode"
        label="Direct entry"
        color="primary"
        hide-details
      ></v-switch>
    </div>
  </div>

  <template v-if="entryMode">
    <BulkDataEntryCard
      @save="entryMode = false"
    />
  </template>
  <template v-else>
    <IncrementalDataEntryCard />
  </template>
</template>

<script lang="ts">
import IncrementalDataEntryCard from "./IncrementalDataEntryCard.vue";
import BulkDataEntryCard from "./BulkDataEntryCard.vue";

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
