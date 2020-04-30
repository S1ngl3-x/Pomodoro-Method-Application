<template>
  <v-card
    class="mx-auto text-center"
    color="grey lighten-4"
    max-width="1000"
  >
    <v-card-title>

      <v-row align="start">
        <v-icon
          class="mr-12"
          large
        >
          mdi-clipboard-list-outline
        </v-icon>
        <div class="grey--text text-uppercase">
          Completed tasks
        </div>
        <v-spacer/>
        <div>
          <span class="display-2 font-weight-black">{{peak}}</span>
          <strong>-maximum per day</strong>
        </div>
      </v-row>
    </v-card-title>


    <v-card-text>
      <v-sheet color="grey lighten-4">
        <v-sparkline
          :value="value"
          color="purple"
          height="100"
          padding="24"
          stroke-linecap="round"
          smooth
          auto-draw
          :labels="dates"
        >
          <template :v-slot:label="dates">
          </template>
        </v-sparkline>
      </v-sheet>
    </v-card-text>
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
    name: "graph-tasks",
    props: ["importedTasks"],
    data() {
      return {
        value: null,
        tasks: this.importedTasks,
        dates: [],
        peak: 0,
        taskNames: null,
        saved: false,
      }
    },

    created() {
      const finishedTasksFromLastWeek = this.getFinishedTasksFromPreviousSevenDays(this.tasks);

      this.value = this.getFinishedTasksPerDay(finishedTasksFromLastWeek);
    },

    methods: {
      getFinishedTasksFromPreviousSevenDays(tasks) {
        const weekAgo = moment().subtract(7, "days");

        const finishedTasks = tasks.filter(task => task.status === "COMPLETED");

        const lastWeeksTasks = finishedTasks
          .filter(task => weekAgo.isBefore(moment(task.dateFinished), "day")); // during last week

        return lastWeeksTasks;
      },

      getFinishedTasksPerDay(tasks) {
        let dates = [];
        let finishesPerDay = [0, 0, 0, 0, 0, 0, 0];
        let taskNames = [[], [], [], [], [], [], []];
        const weekDays = 7;

        for (let i = 0; i < weekDays; i++) {
          dates[i] = moment().add((i + 1), "days").subtract(1, "week");

          this.dates[i] = JSON.parse(JSON.stringify(dates[i].format("MMM DD").toString()));
        }

        for (let task of tasks) {
          for (let i = 0; i < weekDays; i++) {
            if (dates[i].isSame(moment(task.dateFinished), 'day')) {
              finishesPerDay[i]++;
              taskNames[i].push(task.name)
              break;
            }
          }
        }

        this.taskNames = taskNames;

        for (let i = 0; i < finishesPerDay.length; i++) {
          if (finishesPerDay[i] > this.peak) {
            this.peak = finishesPerDay[i]
          }
        }

        return finishesPerDay;
      },

      async save() {
        const ownerId = JSON.parse(localStorage.getItem('user'))._id;
        const name = "completed tasks";
        const values = this.value;
        const data = JSON.stringify({
          tasks: this.taskNames,
          dates: this.dates,
          peak: this.peak,
        });
        const icon = "mdi-clipboard-list-outline";

        const result = await reportService.saveReport(ownerId, name, values, data, icon);
        this.saved = true;
      },
    },
  }
</script>

<style scoped>

</style>
