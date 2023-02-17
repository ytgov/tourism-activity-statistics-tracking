<template>
  <v-dialog v-model="visible" persistent max-width="500">
    <v-card v-if="selectedUser">
      <v-toolbar color="primary" variant="dark" title="Edit User">
        <v-spacer></v-spacer>
        <v-btn icon @click="close" color="white"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-card-text>
        <v-text-field
          label="Name"
          v-model="selectedUser.display_name"
          readonly
          variant="outlined"
          density="comfortable"
          append-inner-icon="mdi-lock"></v-text-field>
        <v-text-field
          label="Email"
          v-model="selectedUser.email"
          readonly
          variant="outlined"
          density="comfortable"
          append-inner-icon="mdi-lock"></v-text-field>
        <v-checkbox
          label="System Admin"
          v-model="selectedUser.is_admin"
          variant="outlined"
          density="comfortable"></v-checkbox>
      </v-card-text>
      <v-card-actions class="mx-4 mb-2">
        <v-btn color="primary" variant="flat" @click="save()">Save</v-btn>
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
  name: "UserEditor",
  data: () => ({}),
  computed: {
    ...mapState(useAdminStore, ["selectedUser"]),
    visible() {
      return this.selectedUser ? true : false;
    },
  },
  methods: {
    ...mapActions(useAdminStore, ["unselectUser", "save"]),
    close() {
      this.unselectUser();
    },
  },
};
</script>
<style scoped></style>
