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
        @update:modelValue="selectTodaysDate"
        item-value="id"
      ></v-select>
    </template>

    <template v-slot:center>
      <div style="margin-top: 0px; text-align: center">
        <div style="font-size: 1.5rem; font-weight: bold; line-height: 1.6rem">
          {{ totalCountHeader }}
        </div>
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
        style="max-width: 250px"
      ></v-select>
    </template>

    <div v-if="selectedSite">
      <v-row class="mt-5">
        <v-col></v-col>
        <v-col cols="3">
          <v-text-field
            :modelValue="totalVistorsForDay"
            @update:modelValue="updateTotalVistors"
            type="number"
            min="0"
            label="Daily Total"
            hide-details
          />
        </v-col>
      </v-row>
      <v-row class="mt-5">
        <v-col cols="3">Visitor Origin</v-col>
        <v-col> </v-col>
        <v-col cols="3" class="text-body-1 text-center">
          Daily Totals by Location
        </v-col>
      </v-row>
      <v-row v-for="(location, idx) of selectedDate.origins" :key="idx">
        <v-divider></v-divider>
        <v-col cols="3">
          <div class="text-h6 float-left pt-3">{{ location.name }}</div>
        </v-col>
        <v-col></v-col>
        <v-col cols="3">
          <template v-if="location.name == UNKNOWN_CATEGORY_LOCATION_NAME">
            <v-text-field
              :modelValue="uncategorizedLocation.daily_total"
              @update:modelValue="(newValue) => uncategorizedLocation.daily_total = parseInt(newValue)"
              density="compact"
              hide-details
              min="0"
              readonly
              disabled
              single-line
              type="number"
            ></v-text-field>
          </template>
          <template v-else>
            <v-text-field
              :max="uncategorizedVistors"
              :modelValue="location.daily_total"
              @update:modelValue="
                (newValue) => updateLocationCategoryTotal(location, newValue)
              "
              density="compact"
              hide-details
              min="0"
              single-line
              type="number"
            ></v-text-field>
          </template>
        </v-col>
      </v-row>
    </div>
    <div v-else>Not site selected</div>
  </BaseCard>
</template>

<script lang="ts">
const UNKNOWN_CATEGORY_LOCATION_NAME = "Unknown";

import { mapActions, mapState, mapWritableState } from "pinia";
import moment from "moment";
import { useUserStore } from "@/store/UserStore";
import { useCentreStore } from "../store";

export default {
  name: "BulkDataEntryCard",
  components: {},
  data: () => ({
    isDirty: false,
    totalVistorsForDay: 0,
    UNKNOWN_CATEGORY_LOCATION_NAME,
  }),
  mounted() {
    if (this.loadFor.length > 0) {
      this.loadDailyStats(this.loadFor).then(() => {
        return this.selectFirstToManage();
      });
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
    dateHeader() {
      if (this.selectedSite && this.selectedDate) {
        return `${moment(this.selectedDate.date).format("MMMM D, YYYY")} in ${
          this.selectedSite.name
        }`;
      }

      return "";
    },
    categorizedLocations() {
      return this.selectedDate.origins.filter(
        (location) => location.name !== UNKNOWN_CATEGORY_LOCATION_NAME
      );
    },
    uncategorizedLocation() {
      return this.selectedDate.origins.find(
        (location) => location.name === UNKNOWN_CATEGORY_LOCATION_NAME
      );
    },
    uncategorizedVistors() {
      return this.uncategorizedLocation.daily_total;
    },
    categorizedVistors() {
      return this.categorizedLocations.reduce(
        (total, location) => total + location.daily_total,
        0
      );
    },
  },
  methods: {
    ...mapActions(useUserStore, ["canDo"]),
    ...mapActions(useCentreStore, [
      "save",
      "loadDailyStats",
      "selectFirstToManage",
    ]),
    selectTodaysDate() {
      this.selectedDate = this.selectedSite.days[0];
    },
    updateLocationCategoryTotal(location, value) {
      location.daily_total = parseInt(value);
      this.uncategorizedLocation.daily_total -= parseInt(value)
    },
    updateTotalVistors(value) {
      if (value < this.totalVistorsForDay) {
        // remove uncategorized unill 0
        // successively remove 1 from each other category
        // until total vistors is 0
      } else {
        this.totalVistorsForDay = parseInt(value);
        this.uncategorizedLocation.daily_total = this.totalVistorsForDay - this.categorizedVistors;
      }
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
