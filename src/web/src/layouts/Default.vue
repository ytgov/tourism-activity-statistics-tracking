<template>
  <v-app-bar app color="#fff" flat height="70" style="left: 0; border-bottom: 3px #f3b228 solid">
    <img src="/yukon.svg" style="margin: -8px 85px 0 30px" height="44" />
    <!-- <v-img class="ml-0m pl-0" src="src/assets/yukon.svg" height="44" /> -->

    <v-toolbar-title>
      <span class="font-weight-bold text-h5">{{ title }}</span>

      <v-progress-circular
        :class="loadingClass"
        indeterminate
        color="#f3b228"
        size="20"
        width="2"
        class="ml-4"></v-progress-circular>
    </v-toolbar-title>
    <v-spacer></v-spacer>

    <div v-if="isAuthenticated">
      <v-btn variant="text" size="large" color="primary" class="mr-1" to="/dashboard"><v-icon>mdi-home</v-icon></v-btn>

      <v-divider class="mr-5" vertical inset></v-divider>
      <span> {{ username }} </span>
      <span class="pl-3" @click="toggleAdmin()">
        <v-chip v-if="isAdmin" color="yg_moss"> Admin </v-chip>
        <v-chip v-else color="yg_twilight"> User </v-chip>
      </span>

      <v-btn variant="text" size="large" color="primary">
        <v-icon>mdi-dots-vertical</v-icon>

        <v-menu activator="parent" offset-y class="ml-0">
          <v-list dense style="min-width: 200px">
            <v-list-item to="/profile">
              <template v-slot:prepend>
                <v-icon>mdi-account</v-icon>
              </template>
              <!-- <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon> -->
              <v-list-item-title>My profile</v-list-item-title>
            </v-list-item>

            <v-list-item @click="blip">
              <template v-slot:prepend>
                <v-icon>mdi-information-outline</v-icon>
              </template>
              <v-list-item-title>Show API Message</v-list-item-title>
            </v-list-item>
            <!-- <v-list-item to="/administration" v-if="isAdmin">
              <template v-slot:prepend>
                <v-icon>mdi-cogs</v-icon>
              </template>
              <v-list-item-title>Administration</v-list-item-title>
            </v-list-item> -->
            <v-divider />
            <v-list-item @click="$auth0.logout({ returnTo })">
              <template v-slot:prepend>
                <v-icon>mdi-exit-run</v-icon>
              </template>
              <!-- <v-list-item-icon>
                <v-icon>mdi-exit-run</v-icon>
              </v-list-item-icon> -->
              <v-list-item-title>Sign out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </div>
    <div v-else>
      <login-button />
    </div>
  </v-app-bar>

  <v-main>
    <!-- Provides the application the proper gutter -->
    <!-- fill-height causes the main content to fill the entire page -->
    <v-container fluid class="page-wrapper fill-height">
      <router-view></router-view>
    </v-container>
  </v-main>

  <v-overlay v-model="showOverlay" class="align-center justify-center">
    <div class="text-center">
      <v-progress-circular indeterminate size="64" class="mb-5"></v-progress-circular>
      <h1 class="title">Loading {{ title }}</h1>
    </div>
  </v-overlay>
</template>

<script lang="ts">
import { useUserStore } from "@/store/UserStore";
import { useNotificationStore } from "@/store/NotificationStore";

import { mapState, mapActions, mapWritableState } from "pinia";
// import { mapActions, mapState } from "vuex";
// import { applicationName } from "@/config";
// import { getInstance } from "@/auth/auth0-plugin";
// const auth = getInstance();
export default {
  name: "Layout",

  data() {
    return {
      isAuthenticated: this.$auth0.isAuthenticated,
      authUser: this.$auth0.user,
      loadingClass: "d-none",
      showOverlay: true,
    };
  },
  computed: {
    ...mapWritableState(useNotificationStore, ["showNotification"]),
    ...mapState(useUserStore, ["user", "isAdmin"]),

    title() {
      return "Visitor Analytics";
      // return applicationName;
    },
    username() {
      return this.authUser.name;
    },
    returnTo: function () {
      return window.location.origin;
      // return auth.options.logout_redirect;
    },
    // canAdminister() {
    //   if (this.profile && this.profile.roles && this.profile.roles.length > 0) {
    //     if (this.profile.roles.includes("System Admin")) return true;
    //   }
    //   return false;
    // },
  },

  async mounted() {
    await this.initialize();
    this.showOverlay = false;
  },
  methods: {
    ...mapActions(useUserStore, ["initialize", "toggleAdmin"]),
    blip: function () {
      this.showNotification = true;
    },
  },
};
</script>
