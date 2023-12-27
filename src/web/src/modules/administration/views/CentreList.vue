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

  <h1 class="mb-4">Visitor Centres</h1>

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
      <v-btn color="primary" size="small" variant="flat" prepend-icon="mdi-plus" @click="newCentreClick"
        >New Centre</v-btn
      >
    </template>

    <v-data-table
      :search="search"
      :headers="headers"
      :items="items"
      :loading="isLoading"
      @click:row="rowClick"></v-data-table>
  </base-card>

  <centre-editor></centre-editor>
</template>
<script lang="ts">
import { mapActions, mapState } from "pinia";
import { useAdminStore } from "../store";
import CentreEditor from "../components/CentreEditor.vue";

export default {
  components: { CentreEditor },
  data: () => ({
    headers: [
      { title: "Name", value: "name" },
      { title: "Community", value: "community" },
      { title: "Region", value: "region" },
    ],
    search: "",
  }),
  computed: {
    ...mapState(useAdminStore, ["centres", "isLoading"]),
    items() {
      return this.centres;
    },
    totalItems() {
      return this.centres.length;
    },
    breadcrumbs() {
      return [
        {
          title: "Administration",
          to: "/administration",
        },
        {
          title: "Visitor Centres",
        },
      ];
    },
  },
  beforeMount() {
    this.loadItems();
  },
  methods: {
    ...mapActions(useAdminStore, ["getAllCentres", "selectCentre"]),

    async loadItems() {
      await this.getAllCentres();
    },
    rowClick(event: Event, thing: any) {
      this.selectCentre(thing.item);
    },
    newCentreClick() {
      this.selectCentre({ is_active: true });
    },
  },
};
</script>
