<template>
  <v-app-bar
    dense
    max-height="45"
    class="pa-0 ma-0 white"
    elevation="0"
  >
    <v-btn icon to="/about">
      <v-icon class="ma-2">mdi-information</v-icon>
    </v-btn>

    <v-toolbar-title style="color: purple" class="font-weight-medium">Felodoro</v-toolbar-title>

    <v-spacer></v-spacer>

    <user-menu v-if="user" v-show="logged" class="disable-dbl-tap-zoom" :user="user" :logged="logged"/>

  </v-app-bar>
</template>

<script>
  import UserMenu from "../menus/UserMenu";

  export default {
    name: "top-mobile-navigation",
    components: {UserMenu},
    props: ["user", "logged"],
  }
</script>

<style scoped>

</style>
