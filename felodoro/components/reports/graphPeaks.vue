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
          mdi-calendar-clock
        </v-icon>

        <div class=" grey--text text-uppercase">
          Concentrated working time each day
        </div>
        <v-spacer/>
        <div>
          <span class="display-2 font-weight-black">{{sum}}</span>
          <strong>mins total</strong>
        </div>
      </v-row>
    </v-card-title>

    <v-container fluid>
      <v-sparkline
        :fill="fill"
        :gradient="gradient"
        :line-width="width"
        :padding="padding"
        :smooth="radius || false"
        :value="value"
        auto-draw
        max-width="600"
        show-labels
        :labels="value"
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
    name: "graph-peaks",
    props: ["importedTasks"],
    data() {
      return {
        tasks: this.importedTasks,
        dates: [],
        sum: 0,
        taskNames: null,
        saved: false,


        fill: true,
        gradient: ['#f72047', '#ffd200', '#1feaea'],
        padding: 8,
        radius: 10,
        value: [],
        width: 2,
      }
    },

    created() {
      this.tasks = this.getTasksFromPreviousSevenDays(this.tasks);
      const dates = this.prepareDates();
      this.value = this.computeTimeSpentPerDay(this.tasks, dates);
      this.sum = this.computeSum(this.value);
    },

    methods: {
      getTasksFromPreviousSevenDays(tasks) {
        const weekAgo = moment().subtract(7, "days");

        const lastWeeksTasks = tasks
          .filter(task => weekAgo.isBefore(moment(task.dateFinished), "day")); // during last week

        return lastWeeksTasks;
      },

      prepareDates() {
        let dates = [];
        const weekDays = 7;

        for (let i = 0; i < weekDays; i++) {
          dates[i] = moment().add((i + 1), "days").subtract(1, "week");
          this.dates[i] = JSON.parse(JSON.stringify(dates[i].format("MMM DD").toString()));
        }

        return dates;
      },

      computeTimeSpentPerDay(tasks, dates) {
        let minutesPerDay = [0, 0, 0, 0, 0, 0, 0];
        let taskNames = [[],[],[],[],[],[],[]];
        const weekDays = 7;

        for (let task of tasks) {
          for (let i = 0; i < weekDays; i++) {
            if (dates[i].isSame(moment(task.dateFinished), 'day')) {
              minutesPerDay[i] += this.getTimeSpentOnPomodoros(task);
              taskNames[i].push(task.name)
              break;
            }
          }
        }

        this.taskNames = taskNames;

        return minutesPerDay;
      },

      getTimeSpentOnPomodoros(task) {
        const pomodorosSpent = task.pomodorosSpent;

        const timeSpent = pomodorosSpent
          .reduce((sum, pomodoro) => sum + pomodoro.timeTotal.minutes, 0);

        return timeSpent
      },

      computeSum(times) {
        return times.reduce((sum, time) => sum + time, 0);
      },

      async save() {
        const ownerId = JSON.parse(localStorage.getItem('user'))._id;
        const name = "working time";
        const values = this.value;
        const data = JSON.stringify({
          tasks: this.taskNames,
          dates: this.dates,
          sum: this.sum,
        });
        const icon = "mdi-calendar-clock";

        const result = await reportService.saveReport(ownerId, name, values, data, icon);
        this.saved = true;
      },
    },
  }
</script>

<style scoped>

</style>
