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
        <v-col>
          <v-text-field
            :value="totalVistorsForDay"
            type="number"
            min="0"
            label="Daily Total"
            hide-details
            @input="updateFullTotal"
          />
        </v-col>
        <v-col cols="3" class="text-body-1 text-center">
          Daily Totals by Location
        </v-col>
      </v-row>
      <v-row v-for="(location, idx) of selectedDate.origins" :key="idx">
        <v-divider></v-divider>
        <v-col cols="3">
          <div class="text-h6 float-left pt-3">{{ location.name }}</div>
        </v-col>
        <v-col class="text-h6 text-center pt-3">
          <v-slider
            v-model="slider"
            class="align-center"
            :max="unallocatedVistors"
            min="0"
            hide-details
          >
            <template v-slot:append>
              <v-text-field
                v-model="slider"
                :value="location.daily_total"
                hide-details
                single-line
                density="compact"
                type="number"
                :max="max"
                min="0"
                @input="updateLocationCategoryTotal(location, $event.target.value)"
              ></v-text-field>
            </template>
          </v-slider>
        </v-col>
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
    isDirty: false,
    dailyTotalVisitors: 0,
  }),
  mounted() {
    if (this.loadFor.length > 0) {
      this.loadDailyStats(this.loadFor).then(() => {
        return this.selectFirstToManage();
      })
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
      if (this.totalVistorsForDay > 0) {
        return `${this.totalVistorsForDay} visitors`;
      }
      return "";
    },
    totalVistorsForDay() {
      if (this.selectedDate && this.selectedDate.origins) {
        let counts = this.selectedDate.origins.flatMap((i: any) => i.daily_total);
        let total = counts.reduce((t: number, i: any) => t + i, 0);
        return total;
      }

      return 0
    },
    dateHeader() {
      if (this.selectedSite && this.selectedDate) {
        return `${moment(this.selectedDate.date).format("MMMM D, YYYY")} in ${this.selectedSite.name}`;
      }

      return "";
    },
    unknownLocation() {
      if (this.selectedSite && this.selectedDate) {
        return this.selectedDate.origins.find(location => location.name == "Unknown")
      }

      return {}
    },
    unallocatedVistors() {
      return this.unknownLocation.daily_total || 0
    }
  },
  methods: {
    ...mapActions(useUserStore, ["canDo"]),
    ...mapActions(useCentreStore, ["save", "loadDailyStats", "selectFirstToManage"]),
    siteChanged() {
      this.selectedDate = this.selectedSite.days[0];
    },
    updateLocationCategoryTotal(location: any, value: Number) {
      this.isDirty = true
      location.daily_total = parseInt(value);
    },
    updateFullTotal(value) {
      // get total of all
    }
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
