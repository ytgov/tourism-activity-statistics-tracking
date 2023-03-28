<template>
  <div>
    <v-btn dark color="primary" @click="login">Sign In</v-btn>
  </div>
</template>

<script lang="ts">
export default {
  data: function () {
    return {};
  },
  methods: {
    login() {
      let target = window.location.pathname;
      if (target == "/sign-in") target = "/dashboard";

      this.$auth.loginWithRedirect({
        appState: { target },
      });
    },
  },
  computed: {},
};
</script>
