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

        <v-select
          label="Send data entry reminder emails at"
          v-model="selectedCentre.reminders_at"
          :items="reminderAtOptions"
          multiple
          chips
          clearable
          deletable-chips
          variant="outlined"
          density="comfortable"></v-select>
        <v-select
          label="Send data entry reminder emails if"
          v-model="selectedCentre.reminders_when"
          :items="reminderIfOptions"
          chips
          clearable
          deletable-chips
          variant="outlined"
          density="comfortable"></v-select>
        <v-row>
          <v-col
            ><v-checkbox
              label="Active?"
              v-model="selectedCentre.is_active"
              variant="outlined"
              density="comfortable"></v-checkbox>
          </v-col>
        </v-row>
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
  data: () => ({
    reminderAtOptions: [
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
      "18:00",
      "18:30",
      "19:00",
    ],
    reminderIfOptions: [
      "If no data entered in day",
      "If no data entered in last 4 hours",
      "If no data entered in last 1 hour",
    ],
  }),
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
