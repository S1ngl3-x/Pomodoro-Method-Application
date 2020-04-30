<template>
  <v-container>
    <v-tabs centered>
      <v-tabs-slider/>
      <v-tab>Daily</v-tab>
      <v-tab>All<span v-if="oldNewTasks !== 0"> ({{oldNewTasks}})</span></v-tab>

      <v-tab-item>
        <daily-tasks :tasks="dailyTasks" :countdown-running="countdownRunning" :loading="loading"/>
      </v-tab-item>
      <v-tab-item>
        <all-tasks :tasks="allTasks" :countdown-running="countdownRunning"/>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
  import Task from "../tasks/Task";
  import DailyTasks from "../tasks/DailyTasks";
  import AllTasks from "../tasks/AllTasks";
  import taskService from "./../../services/taskService";

  export default {
    name: "top-task-nav",
    components: {AllTasks, DailyTasks, Task},
    props: ["dailyTasks", "allTasks", "countdownRunning", "loading"],
    computed: {
      oldNewTasks() {
        const today = new Date();
        return [...this.allTasks].filter(task => task.status === "NEW" && ! taskService.sameDay(today, new Date(task.dateAssigned))).length;
      }
    },
  }
</script>

<style scoped>

</style>
