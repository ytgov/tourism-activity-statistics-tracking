<template>
  <v-dialog v-model="visible" persistent max-width="500">
    <v-card v-if="selectedCentre">
      <v-toolbar color="primary" variant="dark" :title="title">
        <v-spacer></v-spacer>
        <v-btn icon @click="close" color="white"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-card-text>
        <v-text-field
          label="Name"
          v-model="selectedCentre.name"
          variant="outlined"
          density="comfortable"></v-text-field>
        <v-text-field
          label="Community"
          v-model="selectedCentre.community"
          variant="outlined"
          density="comfortable"></v-text-field>
        <v-text-field
          label="Region"
          v-model="selectedCentre.region"
          variant="outlined"
          density="comfortable"></v-text-field>
        <v-checkbox
          label="Active?"
          v-model="selectedCentre.is_active"
          variant="outlined"
          density="comfortable"></v-checkbox>
      </v-card-text>
      <v-card-actions class="mx-4 mb-2">
        <v-btn color="primary" variant="flat" @click="saveCentre()">Save</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="yg_sun" variant="outlined" @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { mapActions, mapState } from "pinia";
import { useAdminStore } from "../store";

export default {
  name: "CentreEditor",
  data: () => ({}),
  computed: {
    ...mapState(useAdminStore, ["selectedCentre"]),
    visible() {
      return this.selectedCentre ? true : false;
    },
    title() {
      return this.selectedCentre && this.selectedCentre.id ? "Edit Visitor Centre" : "New Visitor Centre";
    },
  },
  methods: {
    ...mapActions(useAdminStore, ["unselectCentre", "saveCentre"]),
    close() {
      this.unselectCentre();
    },
  },
};
</script>
<style scoped></style>
