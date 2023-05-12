<template>
  <BaseCard showHeader="t" heading="" class="pb-3">
    <template v-slot:left>
      <v-select
        :items="manageSites"
        label="Site"
        hide-details
        v-model="selectedSite"
        return-object
        style="max-width: 250px"
        item-title="name"
        :disabled="isDirty"
        @update:modelValue="changed"
        item-value="id"></v-select>
    </template>

    <template v-slot:center>
      <div style="margin-top: 0px; text-align: center">
        <div style="font-size: 1.5rem; font-weight: bold; line-height: 1.6rem">{{ totalCountHeader }}</div>
        {{ dateHeader }}
      </div>
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
        style="max-width: 250px"></v-select>
    </template>

    <div v-if="selectedSite">
      <v-row class="mt-5">
        <v-col cols="3">Visitor Origin</v-col>
        <v-col></v-col>
        <v-col cols="3" class="text-body-1 text-center"> Daily Totals </v-col>
        <!-- <v-col cols="3" class="text-body-1 text-center"> Weekly Totals </v-col> -->
      </v-row>
      <v-row v-for="(location, idx) of selectedDate.origins" :key="idx">
        <v-divider></v-divider>
        <v-col cols="3">
          <div class="text-h6 float-left pt-3">{{ location.name }}</div>
        </v-col>
        <v-col>
          <div class="text-center">
            <v-btn variant="flat" color="#3A8340" icon="" class="mr-3" @click="plusOne(location)"
              ><span style="color: white">+1</span></v-btn
            >
            <v-btn variant="flat" color="#3A8340" icon="" class="mr-10" @click="plusFive(location)"
              ><span style="color: white">+5</span></v-btn
            >
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
import moment from "moment";
import { useUserStore } from "@/store/UserStore";
import { useCentreStore } from "../store";

export default {
  name: "BulkDataEntryCard",
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
    totalCountHeader() {
      if (this.selectedDate && this.selectedDate.origins) {
        let counts = this.selectedDate.origins.flatMap((i: any) => i.daily_total);
        let total = counts.reduce((t: number, i: any) => t + i, 0);
        return `${total} visitors`;
      }
      return "";
    },
    dateHeader() {
      if (this.selectedSite && this.selectedDate) {
        return `${moment(this.selectedDate.date).format("MMMM D, YYYY")} in ${this.selectedSite.name}`;
      }

      return "";
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

<style>
.v-btn.v-btn--disabled.bg-orange {
  background-color: #895200 !important;
}
.v-btn.v-btn--disabled.bg-orange .v-btn__overlay {
  opacity: 0;
}

.v-btn.v-btn--disabled.bg-orange .v-btn__content {
  color: white !important;
}
</style>
