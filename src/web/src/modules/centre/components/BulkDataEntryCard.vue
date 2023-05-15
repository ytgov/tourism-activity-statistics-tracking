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
        style="max-width: 250px"
      ></v-select>
    </template>

    <div v-if="selectedSite">
      <v-row class="mt-5">
        <v-col></v-col>
        <v-col md="3">
          <v-text-field
            :modelValue="totalVistorsForDay"
            @update:modelValue="updateTotalVistors"
            type="number"
            min="0"
            label="Total Vistors for Day"
            hide-details
          />
        </v-col>
      </v-row>
      <v-row class="mt-5">
        <v-col>Visitor Origin</v-col>
        <v-col md="3"> Daily Visitors </v-col>
      </v-row>
      <v-row v-for="(location, idx) of selectedDate.origins" :key="idx">
        <v-divider></v-divider>
        <v-col>
          <div class="text-h6 float-left pt-3">{{ location.name }}</div>
        </v-col>
        <v-col md="3">
          <template v-if="location.id === uncategorizedLocation.id">
            <v-text-field
              :modelValue="uncategorizedVistors"
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
              :max="totalVistorsForDay - categorizedVistorsExceptThoseIn(location)"
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
      <v-row>
        <v-col></v-col>
        <v-col sm="6" md="3">
          <v-btn color="primary" size="large" block @input="save">Save</v-btn>
        </v-col>
      </v-row>
    </div>
    <div v-else>Not site selected</div>
  </BaseCard>
</template>

<script lang="ts">
import { mapActions, mapState, mapWritableState } from "pinia";
import moment from "moment";
import { isEmpty } from "lodash";

import { useUserStore } from "@/store/UserStore";
import { useCentreStore } from "../store";

const UNKNOWN_CATEGORY_LOCATION_NAME = "Unknown";

export default {
  name: "BulkDataEntryCard",
  components: {},
  data: () => ({
    totalVistorsForDay: 0,
  }),
  mounted() {
    if (!isEmpty(this.dataEntrySites)) {
      this.loadDailyStats(this.dataEntrySites).then(() => {
        return this.selectFirstToManage();
      });
    }
  },
  computed: {
    ...mapState(useUserStore, ["dataEntrySites"]),
    ...mapState(useCentreStore, ["dateOptions", "manageSites"]),
    ...mapWritableState(useCentreStore, ["selectedDate", "selectedSite"]),
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
    ...mapActions(useCentreStore, [
      "save",
      "loadDailyStats",
      "selectFirstToManage",
    ]),
    selectTodaysDate() {
      this.selectedDate = this.selectedSite.days[0];
    },
    categorizedVistorsExceptThoseIn(excludedLocation) {
      return this.categorizedVistors - excludedLocation.daily_total
    },
    parseAndNaturalizeNumber(value) {
      return Math.max(0, parseInt(value) || 0)
    },
    updateUncategorizedVistors() {
      this.uncategorizedLocation.daily_total =
        this.totalVistorsForDay - this.categorizedVistors;
    },
    updateLocationCategoryTotal(location, value) {
      const normalizedValue = this.parseAndNaturalizeNumber(value)

      const maxAvailableVisitors = this.totalVistorsForDay - this.categorizedVistorsExceptThoseIn(location)
      const maxLimitedValule = Math.min(normalizedValue, maxAvailableVisitors)

      location.daily_total = maxLimitedValule;
      this.updateUncategorizedVistors();
    },
    updateTotalVistors(value) {
      const normalizedValue = this.parseAndNaturalizeNumber(value)

      if (normalizedValue < this.totalVistorsForDay) {
        this.totalVistorsForDay = normalizedValue;
        // TODO
        // remove uncategorized unil 0
        // successively remove 1 from each other category
        // until total vistors is 0
      } else {
        this.totalVistorsForDay = normalizedValue;
        this.updateUncategorizedVistors();
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
