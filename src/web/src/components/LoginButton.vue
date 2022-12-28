<template>
  <div>
    <v-btn dark color="primary" @click="login">Sign In</v-btn>
  </div>
</template>

<script>
export default {
  data: function () {
    return {};
  },
  methods: {
    login() {
      this.$auth0.loginWithRedirect({
        appState: { target: window.location.pathname },
      });
    },
  },
  computed: {
    user: function () {
      console.log(this.$auth0);
      return this.$auth0.user;
    },
    stuff: function () {
      return window.location.pathname;
    },
  },
};
</script>
r
