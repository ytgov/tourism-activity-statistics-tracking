<template>
  <v-dialog v-model="visible" persistent max-width="800">
    <v-card v-if="selectedKiosk">
      <v-toolbar color="primary" variant="dark" title="Enter Kiosk Stats">
        <v-spacer></v-spacer>
        <v-btn icon @click="close" color="white"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="3">
            <v-menu
              v-model="selectedKiosk.start_date_menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px">
              <template v-slot:activator="{ props }">
                <v-text-field
                  label="Start date"
                  v-bind="props"
                  v-model="selectedKiosk.start_date"
                  variant="outlined"
                  density="comfortable"
                  append-inner-icon="mdi-calendar"></v-text-field>
              </template>

              <v-date-picker
                density="comfortable"
                v-model="selectedKiosk.start_date_val"
                color="primary"
                @update:modelValue="setStartDate"></v-date-picker>
            </v-menu>

            <v-menu
              v-model="selectedKiosk.end_date_menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px">
              <template v-slot:activator="{ props }">
                <v-text-field
                  label="End date"
                  v-bind="props"
                  v-model="selectedKiosk.end_date"
                  variant="outlined"
                  density="comfortable"
                  append-inner-icon="mdi-calendar"></v-text-field>
              </template>

              <v-date-picker
                density="comfortable"
                v-model="selectedKiosk.end_date_val"
                color="primary"
                @update:modelValue="setEndDate"></v-date-picker>
            </v-menu>

            <v-text-field
              label="Kiosk"
              v-model="selectedKiosk.kiosk_name"
              variant="outlined"
              density="comfortable"></v-text-field>

            <v-btn @click="selectedKiosk.items.push({ duration: 0, playouts: 0 })" color="info" class="">Add Row</v-btn>
          </v-col>
          <v-divider vertical thickness="1"></v-divider>

          <v-col cols="9" class="pt-5">
            <v-row v-for="(item, idx) of selectedKiosk.items">
              <v-col class="py-1">
                <v-text-field
                  label="Item"
                  v-model="item.playout_item"
                  variant="outlined"
                  hide-details
                  density="comfortable"></v-text-field>
              </v-col>
              <v-col class="py-1">
                <v-text-field
                  label="Playouts"
                  v-model="item.playout_count"
                  variant="outlined"
                  type="number"
                  hide-details
                  density="comfortable"></v-text-field>
              </v-col>
              <v-col class="d-flex py-1" cols="5">
                <v-text-field
                  label="Duration"
                  v-model="item.playout_seconds"
                  variant="outlined"
                  :hint="`${checkInput(item)} seconds`"
                  persistent-hint
                  density="comfortable"></v-text-field>

                <v-btn
                  color="warning"
                  size="x-small"
                  class="mt-2 ml-3"
                  icon="mdi-delete"
                  @click="deleteRowClick(item, idx)"></v-btn>
              </v-col>
            </v-row>
            <v-divider class="mt-6 mb-2"></v-divider>
            <v-row>
              <v-col class="pl-7">Total</v-col>
              <v-col class="pl-7">
                {{ selectedKiosk.items.reduce((a: number, i: any) => a + parseFloat(i.playout_count ?? "0"), 0) }}
              </v-col>
              <v-col class="pl-7" cols="5">
                {{ selectedKiosk.items.reduce((a: number, i: any) => a + parseFloat(checkInput(i)), 0) }} seconds
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="mx-4 mb-2">
        <v-btn color="primary" variant="flat" @click="saveClick()" :disabled="!canSave">Save Stats</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="yg_sun" variant="outlined" @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { useUserStore } from "@/store/UserStore";
import { mapActions, mapState } from "pinia";
import { useAdminStore } from "../store";
import moment from "moment";

export default {
  name: "KioskEditor",
  data: () => ({
    items: [] as any[],
  }),
  computed: {
    ...mapState(useAdminStore, ["selectedKiosk", "kiosks"]),
    ...mapState(useUserStore, ["permissions"]),
    visible() {
      return this.selectedKiosk ? true : false;
    },
    canSave() {
      if (
        this.selectedKiosk.start_date &&
        this.selectedKiosk.end_date &&
        this.selectedKiosk.kiosk_name &&
        this.selectedKiosk.items.length > 0
      ) {
        for (let item of this.selectedKiosk.items) {
          if (item.playout_item && item.playout_count && item.playout_seconds) continue;
          else return false;
        }

        return true;
      }

      return false;
    },
  },
  methods: {
    ...mapActions(useAdminStore, ["unselectKiosk", "saveKiosk", "deleteKiosk"]),
    close() {
      this.unselectKiosk();
    },
    deleteRowClick(item: any, idx: number) {
      this.selectedKiosk.items.splice(idx, 1);
      if (item.playout_id) this.deleteKiosk(item);
    },
    saveClick() {
      for (let row of this.selectedKiosk.items) {
        row.playout_seconds = this.checkInput(row);
      }

      this.saveKiosk();
    },

    checkInput(item: any) {
      if (!item.playout_seconds) return "0";

      let parts = `${item.playout_seconds ?? ""}`.split(":");

      if (parts.length < 2) return item.playout_seconds;
      else if (parts.length == 2) {
        // minutes and seconds
        let minutes = parseInt(parts[0]);
        let seconds = parseInt("0" + parts[1]);
        return minutes * 60 + seconds;
      } else if (parts.length == 3) {
        // hours, minuutes and seconds
        let hours = parseInt(parts[0]);
        let minutes = parseInt("0" + parts[1] ?? 0);
        let seconds = parseInt("0" + parts[2] ?? 0);
        return hours * 3600 + minutes * 60 + seconds;
      }

      return "0";
    },

    setStartDate(t: Date | undefined) {
      if (t) {
        this.selectedKiosk.start_date = moment(t).format("YYYY-MM-DD");
      }
      this.selectedKiosk.start_date_menu = false;
    },
    setEndDate(t: Date | undefined) {
      if (t) {
        this.selectedKiosk.end_date = moment(t).format("YYYY-MM-DD");
      }
      this.selectedKiosk.end_date_menu = false;
    },
  },
};
</script>
