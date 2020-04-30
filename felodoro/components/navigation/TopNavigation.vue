<template>
  <v-app-bar
    :clipped-left="clipped"
    fixed
    app
    grow
  >
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon to="/about" v-on="on" >
          <v-icon class="ma-2">mdi-information</v-icon>
        </v-btn>
      </template>
      <span>About Felodoro application</span>
    </v-tooltip>
    <v-toolbar-title class="flex-shrink-0" v-text="title"/>

    <v-tabs align-with-title grow color="purple lighten-1">
      <v-tab to="/">
        <v-icon>mdi-account-clock</v-icon>
        <span>Home</span>
      </v-tab>

      <v-tab to="/tasks">
        <v-icon>mdi-clipboard-check-multiple</v-icon>
        <span>Tasks</span>
      </v-tab>

      <v-tab to="/reports">
        <v-icon>mdi-chart-areaspline</v-icon>
        <span>Reports</span>
      </v-tab>
    </v-tabs>

    <user-menu v-if="user" v-show="logged" class="disable-dbl-tap-zoom" :user="user" :logged="logged"/>
  </v-app-bar>
</template>

<script>
  import UserMenu from "../menus/UserMenu";

  export default {
    name: "top-nav",
    components: {UserMenu},
    props: ["user", "logged"],
    data() {
      return {
        title: 'Felodoro',
        clipped: false,
      }
    },
    methods: {
      async redirectToAbout() {
        await this.$router.push("/about");
      },
    },
  }
</script>

<style scoped>

</style>
