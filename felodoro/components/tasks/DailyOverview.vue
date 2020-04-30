<template>
  <v-card
    class="mx-auto"
    max-width="344"
    outlined
    elevation="1"
  >
    <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-title class="headline mb-1">Daily Tasks &</v-list-item-title>
        <div class="overline mb-4">Done: {{tasksDone}}</div>
        <div class="overline mb-4">Unfinished: {{tasksUnfinished}}</div>
        <div class="overline mb-4">Total: {{tasksTotal}}</div>
      </v-list-item-content>

      <v-list-item-content>
        <v-list-item-title class="headline mb-1">Pomodoros</v-list-item-title>
        <div class="overline mb-4">Done: {{pomodorosDone}}</div>
        <div class="overline mb-4">Estimated: {{pomodorosEstimated}}</div>
        <div class="overline mb-4">Minutes spent: {{timeSpent}}</div>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
  export default {
    name: "daily-overview",
    props: ["tasksDone", "tasksUnfinished", "tasksTotal", "pomodorosDone", "pomodorosEstimated", "timeSpent"],
  }
</script>

<style scoped>
</style>
