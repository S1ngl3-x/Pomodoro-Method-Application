<template>
  <v-card
    class="mx-auto"
    color="grey lighten-4"
    max-width="1000"
  >
    <v-card-title>

      <v-row align="start">
        <v-icon
          class="mr-12"
          size="64"
          large
        >
          mdi-math-compass
        </v-icon>

        <div class=" grey--text text-uppercase">
          Estimation deviation
        </div>
        <v-spacer/>
        <div>
          <span class="display-2 font-weight-black">{{accuracy}}%</span>
          <strong>accuracy</strong>
        </div>
      </v-row>
    </v-card-title>
    <v-container fluid>
      <v-sparkline
        :value="value"
        :gradient="gradient"
        :smooth="radius || false"
        :padding="padding"
        :line-width="lineWidth"
        :stroke-linecap="lineCap"
        :gradient-direction="gradientDirection"
        :fill="fill"
        :type="type"
        :auto-line-width="autoLineWidth"
        auto-draw
        :show-labels="showLabels"
        :labels="taskNames"
        :label-size="labelSize"
      ></v-sparkline>

    </v-container>

    <v-divider></v-divider>

    <v-card-actions class="justify-center">
      <v-btn block text @click="save">
        Save report

        <v-scroll-x-transition>
          <v-icon
            v-if="saved"
            color="success"
          >
            mdi-check
          </v-icon>
        </v-scroll-x-transition>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import moment from "moment";
  import reportService from "../../services/reportService";

  export default {
    name: "graph-dots",
    props: ["importedTasks"],
    data() {
      return {
        tasks: this.importedTasks,
        taskNames: null,
        accuracy: null,
        saved: false,
        showLabels: true,
        lineWidth: 2,
        labelSize: 3,
        radius: 10,
        padding: 8,
        lineCap: 'round',
        gradient: ['#00c6ff', '#F0F', '#FF0'],
        value: [],
        gradientDirection: 'left',
        fill: false,
        type: 'bar',
        autoLineWidth: false,
      }
    },

    created() {
      const finishedTasksFromLastWeek = this.getFinishedTasksFromPreviousSevenDays(this.tasks);
      const tasksWithEstimations = this.getTasksWithEstimations(finishedTasksFromLastWeek);

      this.value = this.computeDeviation(tasksWithEstimations);
      this.accuracy = this.computeAccuracy(this.value);

      if (this.accuracy === "NaN") this.accuracy = 0; // if no data exists
    },

    methods: {
      getFinishedTasksFromPreviousSevenDays(tasks) {
        const weekAgo = moment().subtract(7, "days");

        return tasks
          .filter(task => task.status === "COMPLETED"
            && weekAgo.isBefore(moment(task.dateFinished), "day"));
      },

      getTasksWithEstimations(tasks) {
        return tasks.filter(task => task.pomodorosEstimated !== 0);
      },

      computeDeviation(tasks) {
        const myTasks = tasks.reverse();

        this.taskNames = myTasks.map(task => task.name);

        return myTasks
          .map(task => (task.pomodorosSpentCount) - (task.pomodorosEstimated));
      },

      computeAccuracy(tasks) {
        const correctEstimations = tasks
          .filter(number => number === 0).length;

        const result = correctEstimations / tasks.length;

        return (result * 100).toFixed(0);
      },

      async save() {
        const ownerId = JSON.parse(localStorage.getItem('user'))._id;
        const name = "estimation deviation";
        const values = this.value;
        const data = JSON.stringify({
          tasks: this.taskNames,
          accuracy: this.accuracy,
        });
        const icon = "mdi-math-compass";

        const result = await reportService.saveReport(ownerId, name, values, data, icon);
        this.saved = true;
      },
    },
  }
</script>

<style scoped>

</style>
