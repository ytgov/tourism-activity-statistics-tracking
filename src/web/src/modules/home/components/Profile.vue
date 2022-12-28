<template>
  <div>
    <h1>My Profile</h1>
    <p>** This information is all read-only</p>
    <v-row>
      <v-col cols="6">
        <v-text-field
          v-model="profile.first_name"
          dense
          outlined
          label="First name"
          readonly
          hide-details
          append-icon="mdi-lock"
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="profile.last_name"
          dense
          outlined
          label="Last name"
          readonly
          hide-details
          append-icon="mdi-lock"
        ></v-text-field>
      </v-col>

      <v-col cols="6">
        <v-text-field
          v-model="profile.email"
          dense
          outlined
          label="Email"
          readonly
          hide-details
          append-icon="mdi-lock"
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
          dense
          outlined
          label="Roles"
          v-model="myRoles"
          readonly
          append-icon="mdi-lock"
          hide-details
        >
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="getRoles()">Get Roles </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { useUserStore } from "@/store/UserStore";
import { mapActions } from "pinia";
export default {
  setup() {
    // const m = useUserStore();
    // return { m };
  },
  name: "Profile",
  data() {
    return {
      profile: this.$auth0.user,
    };
  },
  computed: {
    myRoles: function () {
      // if (this.roles && this.roles.length > 0) return this.roles.join(", ");
      return ["Editor", "Admin", "Super Admin"].join(", ");
      // return this.currentUser.roles;
    },
  },
  methods: {
    ...mapActions(useUserStore, ["getRoles"]),
  },
};
</script>
