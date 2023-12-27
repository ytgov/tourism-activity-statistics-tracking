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

  <h1 class="mb-4">Kiosk Data</h1>

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
      <v-btn color="primary" size="small" variant="flat" prepend-icon="mdi-plus" @click="addClick"
        >Add Kiosk Stats</v-btn
      >
    </template>

    <v-data-table :search="search" :headers="headers" :items="items" :loading="isLoading" @click:row="rowClick">
      <template v-slot:item.totalPlayouts="{ item }">{{ totalPlayouts(item) }}</template>
      <template v-slot:item.totalDuration="{ item }">{{ totalDuration(item) }}</template>
    </v-data-table>
  </base-card>

  <kiosk-editor></kiosk-editor>
</template>
<script lang="ts">
import { mapActions, mapState } from "pinia";
import { cloneDeep } from "lodash";
import { useAdminStore } from "../store";
import KioskEditor from "../components/KioskEditor.vue";

export default {
  components: { KioskEditor },
  data: () => ({
    headers: [
      { title: "Name", key: "kiosk_name" },
      { title: "Start Date", key: "start_date" },
      { title: "End Date", key: "end_date" },
      { title: "Items", key: "items.length" },
      { title: "Total Playouts", key: "totalPlayouts" },
      { title: "Total Duration", key: "totalDuration" },
    ],
    search: "",
  }),
  computed: {
    ...mapState(useAdminStore, ["kiosks", "isLoading"]),
    items() {
      return this.kiosks;
    },
    totalItems() {
      return this.kiosks.length;
    },
    breadcrumbs() {
      return [
        {
          title: "Administration",
          to: "/administration",
        },
        {
          title: "Kiosk Data",
        },
      ];
    },
  },
  beforeMount() {
    this.loadItems();
  },
  methods: {
    ...mapActions(useAdminStore, ["getAllKiosks", "selectKiosk"]),

    async loadItems() {
      await this.getAllKiosks();
    },
    addClick() {
      this.selectKiosk({ items: [] });
    },
    rowClick(event: Event, thing: any) {
      let editItem = cloneDeep(thing.item);
      this.selectKiosk(editItem);
    },

    totalPlayouts(row: any) {
      return row.items.reduce((a: number, t: any) => a + t.playout_count, 0);
    },
    totalDuration(row: any) {
      return row.items.reduce((a: number, t: any) => a + t.playout_seconds, 0);
    },
  },
};
</script>
