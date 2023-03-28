<template>
  <h1 class="text-h5 mb-5">Daily Data Entry</h1>

  <BaseCard showHeader="t" heading="" class="pb-3">
    <template v-slot:left>
      <v-select
        :items="manageSites"
        label="Site"
        hide-details
        v-model="selectedSite"
        return-object
        style="max-width: 220px"
        item-title="name"
        :disabled="isDirty"
        @update:modelValue="changed"
        item-value="id"></v-select>
    </template>
    <template v-slot:right>
      <v-select
        v-model="selectedDate"
        label="Date"
        :items="dateOptions"
        item-title="date"
        return-object
        hide-details
        :disabled="isDirty"
        style="max-width: 220px"></v-select>
    </template>

    <div v-if="selectedSite">
      <v-row class="mt-5">
        <v-col cols="6">Origin</v-col>
        <v-col cols="3" class="text-body-1 text-center"> Daily Totals </v-col>
        <!-- <v-col cols="3" class="text-body-1 text-center"> Weekly Totals </v-col> -->
      </v-row>
      <v-row v-for="(location, idx) of selectedDate.origins" :key="idx">
        <v-divider></v-divider>
        <v-col cols="6">
          <div class="text-h6 float-left pt-3">{{ location.name }}</div>
          <div class="float-right">
            <v-btn variant="flat" color="green" icon="" class="mr-3" @click="plusOne(location)">+1</v-btn>
            <v-btn variant="flat" color="green" icon="" class="mr-10" @click="plusFive(location)">+5</v-btn>
            <v-btn
              variant="flat"
              color="orange"
              icon=""
              class="mr-3"
              @click="minusOne(location)"
              :disabled="location.daily_total - 1 < 0"
              >-1</v-btn
            >
            <v-btn
              variant="flat"
              color="orange"
              icon=""
              class="mr-0"
              @click="minusFive(location)"
              :disabled="location.daily_total - 5 < 0"
              >-5</v-btn
            >
          </div>
        </v-col>

        <v-col cols="3" class="text-h6 text-center pt-3">
          <div class="pt-3">{{ location.daily_total }}</div>
        </v-col>
        <!-- <v-col cols="3" class="text-h6 text-center pt-3">
          <div class="pt-3">{{ location.weekly_total }}</div>
        </v-col> -->
      </v-row>
    </div>
    <div v-else>Not site selected</div>
  </BaseCard>
</template>
<script lang="ts">
import { mapActions, mapState, mapWritableState } from "pinia";
import { useUserStore } from "@/store/UserStore";
import { useCentreStore } from "../store";

export default {
  name: "Dashboard",
  components: {},
  data: () => ({
    total: 0,
    isDirty: false,
  }),
  async mounted() {
    //if (this.user.primary_site && this.user.primary_site != -1) this.site = this.user.primary_site;
    let r = window.setInterval(async () => {
      if (!this.isDirty) return;

      await this.save();
      this.isDirty = false;
    }, 2000);

    if (this.loadFor.length > 0) {
      await this.loadDailyStats(this.loadFor);
      this.selectFirstToManage();
    }
  },
  async beforeUnmount() {
    if (this.selectedDate && this.isDirty) {
      await this.save();
    }
  },
  computed: {
    ...mapState(useUserStore, ["user"]),
    ...mapState(useCentreStore, ["dateOptions", "manageSites"]),
    ...mapWritableState(useCentreStore, ["selectedDate", "selectedSite"]),

    loadFor() {
      return this.user.scopes
        .filter((s: any) => s.name.startsWith("VIC.INPUT"))
        .map((s: any) => parseInt(s.name.replace("VIC.INPUT_", "")));
    },
  },
  methods: {
    ...mapActions(useUserStore, ["canDo"]),
    ...mapActions(useCentreStore, ["save", "loadDailyStats", "selectFirstToManage"]),

    changed() {
      this.selectedDate = (this.selectedSite as any).days[0];
    },

    plusOne(location: any) {
      this.isDirty = true;
      location.delta++;
    },
    plusFive(location: any) {
      this.isDirty = true;
      location.delta += 5;
    },
    minusOne(location: any) {
      this.isDirty = true;
      location.delta--;
    },
    minusFive(location: any) {
      this.isDirty = true;
      location.delta -= 5;
    },
  },
};
</script>
