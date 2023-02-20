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

  <h1>Administration</h1>

  <v-row>
    <v-col>
      <v-card>
        <v-card-text> <RouterLink to="/administration/users">Users</RouterLink> </v-card-text>
      </v-card>
    </v-col>
    <v-col>
      <v-card to="/administration/visitor-centres">
        <v-card-title>Visitor Centres</v-card-title>
        <v-card-text>

          <div style="font-size: 30px">
            {{ centres.length }}
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { useAdminStore } from "../store";
import { mapState } from "pinia";

export default {
  data: () => ({}),
  computed: {
    ...mapState(useAdminStore, ["centres"]),

    breadcrumbs() {
      return [
        {
          title: "Administration",
          to: "/administration",
        },
      ];
    },
  },
};
</script>
