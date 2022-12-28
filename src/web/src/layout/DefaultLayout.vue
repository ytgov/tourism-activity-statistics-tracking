<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DefaultLayout",
});
</script>

<template>
  <v-layout>
    <v-app-bar color="grey-lighten-2"></v-app-bar>
    <v-navigation-drawer color="grey-darken-2" permanent></v-navigation-drawer>
    <v-main>
      TESTING
      <!--The <slot> element is a slot outlet that indicates 
                where the "VIEW" content should be rendered.-->
      <slot></slot>
    </v-main>
  </v-layout>
</template>
