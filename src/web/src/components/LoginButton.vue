<template>
  <div>
    <v-btn dark color="primary" @click="login">Sign In</v-btn>
  </div>
</template>

<script lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";

export default {
  data: function () {
    return {};
  },
  methods: {
    login() {
      const auth = useAuth0();

      auth.loginWithRedirect({
        appState: { target: window.location.pathname },
      });
    },
  },
  computed: {},
};
</script>
r
