<template>
  <v-bottom-navigation grow app horizontal
                       color="purple lighten-1"
  >
    <v-btn to="/">
      <span>Home</span>
      <v-icon>mdi-account-clock</v-icon>
    </v-btn>

    <v-btn to="/tasks">
      <span>Tasks</span>
      <v-icon>mdi-clipboard-check-multiple</v-icon>
    </v-btn>

    <v-btn to="/reports">
      <span>Reports</span>
      <v-icon>mdi-chart-areaspline</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
  export default {
    name: "bottom-nav"
  }
</script>

<style scoped>
</style>
