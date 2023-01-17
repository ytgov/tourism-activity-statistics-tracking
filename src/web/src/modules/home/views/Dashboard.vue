<template>
  <v-container class="fill-height">
    <!-- <v-row class="text-center align-center justify-center fill-height"> -->
    <v-row class="text-center">
      <v-col cols="6">
        <BaseCard class="default">
          <div class="text-h5 font-weight-light mb-10">Here is the dashboard</div>
          <div class="text-h6 font-weight-light mt-5mb-5">Stuff happens here</div>
        </BaseCard>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <SecureAPI />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import SecureAPI from "../components/SecureAPI.vue";

export default {
  name: "Dashboard",
  components: {
    SecureAPI,
  },
};
</script>
