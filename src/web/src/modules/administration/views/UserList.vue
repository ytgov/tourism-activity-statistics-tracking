<template>
  <v-breadcrumbs
    :items="breadcrumbs"
    bg-color="#7A9A01"
    style="margin: -13px -16px 10px -16px"
    class="pl-4 mb-4"
    color="white"
    active-color="#fff">
    <template v-slot:prepend>
      <v-icon color="white" icon="mdi-home"></v-icon>
    </template>
    <template v-slot:divider>
      <v-icon color="white" icon="mdi-chevron-right"></v-icon>
    </template>
  </v-breadcrumbs>

  <base-card showHeader="t" heading="">
    <template v-slot:left>
      <v-text-field
        v-model="search"
        label="Search"
        single-line
        hide-details
        append-inner-icon="mdi-magnify"
        density="compact"
        class="ml-2"></v-text-field>
    </template>
    <template v-slot:right>
      <v-btn color="primary" size="small" variant="flat" prepend-icon="mdi-plus">New User</v-btn>
    </template>

    <v-data-table :search="search" :headers="headers" :items="items" :loading="isLoading" @click:row="rowClick">
      <template v-slot:item.permissions="{ item }">
        <v-chip color="yg_moss" v-if="item.is_admin">Admin</v-chip>
        <div v-else>{{ item.scopes.length }}</div>
      </template>
    </v-data-table>
  </base-card>

  <user-editor></user-editor>
</template>
<script lang="ts">
import { mapActions, mapState } from "pinia";
import { cloneDeep } from "lodash";
import { useAdminStore } from "../store";
import UserEditor from "../components/UserEditor.vue";
import { UserScope } from "@/store/models";

export default {
  components: { UserEditor },
  data: () => ({
    headers: [
      { title: "Name", key: "display_name" },
      { title: "Email", key: "email" },
      { title: "Status", key: "status" },
      { title: "Permisions", key: "permissions" },
    ],
    search: "",
  }),
  computed: {
    ...mapState(useAdminStore, ["users", "isLoading"]),
    items() {
      return this.users;
    },
    totalItems() {
      return this.users.length;
    },
    breadcrumbs() {
      return [
        {
          title: "Administration",
          to: "/administration",
        },
        {
          title: "Users",
        },
      ];
    },
  },
  beforeMount() {
    this.loadItems();
  },
  methods: {
    ...mapActions(useAdminStore, ["getAllUsers", "selectUser"]),

    async loadItems() {
      await this.getAllUsers();
    },
    rowClick(event: Event, thing: any) {
      let editUser = cloneDeep(thing.item);

      let inputScopes = editUser.scopes
        .map((s: string | UserScope) => (typeof s == "string" ? s : s.name))
        .filter((s: string) => {
          return s.startsWith("VIC.INPUT_");
        });

      let manageScopes = editUser.scopes
        .map((s: string | UserScope) => (typeof s == "string" ? s : s.name))
        .filter((s: string) => {
          return s.startsWith("VIC.MANAGE_");
        });

      editUser.inputSites = inputScopes.map((s: string) => parseInt(s.replace("VIC.INPUT_", "")));
      editUser.manageSites = manageScopes.map((s: string) => parseInt(s.replace("VIC.MANAGE_", "")));

      this.selectUser(editUser);
    },
  },
};
</script>
