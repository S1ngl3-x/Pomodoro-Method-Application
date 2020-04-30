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
          large
        >
          mdi-camera-timer
        </v-icon>

        <div class=" grey--text text-uppercase">
          Minutes per task
        </div>
        <v-spacer/>
        <div>
          <span class="display-2 font-weight-black">{{avg}}</span>
          <strong>mins average</strong>
        </div>
      </v-row>
    </v-card-title>

    <v-sheet color="transparent">
      <v-sparkline
        :key="String(avg)"
        :smooth="16"
        :gradient="['#f72047', '#ffd200', '#1feaea']"
        :line-width="3"
        :value="minutesPerTask"
        auto-draw
        stroke-linecap="round"
        show-labels
      ></v-sparkline>
    </v-sheet>
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
    name: "graph-activity",
    props: ["importedTasks"],
    data() {
      return {
        checking: false,
        minutesPerTask: [],
        tasks: this.importedTasks,
        labels: null,
        saved: false,
      }
    },
    computed: {
      avg() {
        const sum = this.minutesPerTask.reduce((sum, minutes) => sum + minutes, 0);
        const length = this.minutesPerTask.length;
        if (!sum && !length) return 0;
        return Math.ceil(sum / length)
      },
    },

    created() {
      this.tasks = this.getFinishedTasksFromPreviousSevenDays(this.tasks);
      this.labels = this.tasks.map(task => task.name).reverse(); // uncomment if task names are desired (they are too long)

      this.computePomodoroTimeEachDay(this.tasks);
    },

    methods: {
      getFinishedTasksFromPreviousSevenDays(tasks) {
        const weekAgo = moment().subtract(7, "days");

        return tasks
          .filter(task => task.status === "COMPLETED"
            && weekAgo.isBefore(moment(task.dateFinished), "day"));
      },

      computePomodoroTimeEachDay(tasks) {
        let finishedPomodorosPerTask = tasks
          .filter(task => task.name !== "unassigned")
          .map(task => task.pomodorosSpent)
          .filter(pomodoros => pomodoros.length !== 0);

        let arrayOfTasksWithTheirTimeSpent = [];

        for (let task of finishedPomodorosPerTask) {
          let arrayOfTimes = task
            .map(task => task.timeTotal.minutes)

          let daySum = arrayOfTimes
            .reduce((sum, time) => sum + time, 0);
          arrayOfTasksWithTheirTimeSpent.push(daySum);
        }
        this.minutesPerTask = arrayOfTasksWithTheirTimeSpent.reverse();
      },

      async save() {
        const ownerId = JSON.parse(localStorage.getItem('user'))._id;
        const name = "minutes per task";
        const values = this.minutesPerTask;
        const data = JSON.stringify({
          tasks: this.labels,
          avg: this.avg,
        });
        const icon = "mdi-camera-timer";

        const result = await reportService.saveReport(ownerId, name, values, data, icon);
        this.saved = true;
      },
    },
  }
</script>

<style scoped>

</style>
