<template>
  <div>
    <h2>Graphs from this week</h2>

    <v-container>
      <v-skeleton-loader
        :loading="loading"
        :transition="transition"
        type="card"
        max-height="700"
        max-width="1000"
        class="mx-auto"
      >

            <span>
                  <graph-tasks v-if="tasks" :imported-tasks="tasks"/>
            </span>

      </v-skeleton-loader>
    </v-container>

    <br>

    <v-container>
      <v-skeleton-loader
        :loading="loading"
        :transition="transition"
        type="card"
        max-height="700"
        max-width="1000"
        class="mx-auto"
      >

            <span>
                  <graph-peaks v-if="tasks" :imported-tasks="tasks"/>
            </span>

      </v-skeleton-loader>
    </v-container>

    <br>

    <v-container>
      <v-skeleton-loader
        :loading="loading"
        :transition="transition"
        type="card"
        max-height="700"
        max-width="1000"
        class="mx-auto"
      >

            <span>
                  <graph-activity v-if="tasks" :imported-tasks="tasks"/>
            </span>

      </v-skeleton-loader>
    </v-container>

    <br>

    <v-container>
      <v-skeleton-loader
        :loading="loading"
        :transition="transition"
        type="card"
        max-height="1000"
        max-width="1000"
        class="mx-auto"
      >

            <span>
            <graph-bars v-if="tasks" :imported-tasks="tasks"/>
            </span>

      </v-skeleton-loader>
    </v-container>

    <br>
    <br>

    <v-btn @click="loadReports">Load saved reports</v-btn>
    <h2 v-if="reports">Saved reports</h2>
    <report v-if="reports" v-for="report in reports" :key="report._id"
            :_id="report._id"
            :value="report.values"
            :date="report.date"
            :name="report.name"
            :imported-data="report.data"
            :owner-id="report.ownerId"
            :icon="report.icon"
    >

    </report>


  </div>
</template>

<script>
  import GraphActivity from "../../components/reports/graphActivity";
  import GraphTasks from "../../components/reports/graphTasks";
  import GraphPeaks from "../../components/reports/graphPeaks";
  import graphBars from "../../components/reports/graphBars";
  import report from "../../components/reports/Report";
  import socket from "./../../socket/index";
  import {SubUserUpdated} from "../../queries/user";
  import {AllTasksForReports} from "../../queries/task";
  import taskService from "./../../services/taskService";
  import reportService from "./../../services/reportService";

  export default {
    middleware: ["first_visit", "authenticated"],
    components: {GraphTasks, GraphActivity, GraphPeaks, graphBars, report},

    data() {
      return {
        tasks: null,
        reports: null,
        loading: null,
        transition: 'scale-transition',
      }
    },

    async created() {
      this.user = await JSON.parse(localStorage.getItem('user'));
      this.loading = true;

      socket.unsubscribeAll();
      this.subscribeForUserUpdated();

      this.tasks = await taskService.loadTasks(this.user, AllTasksForReports);
      this.loading = false;
    },

    methods: {
      subscribeForUserUpdated() {
        const query = SubUserUpdated(this.user.email);

        const subscribe = socket.request({query})
          .subscribe(async (payload) => {
            const newInfo = payload.data.userUpdated;

            let newUser = this.user;
            newUser.pomodoroTime = newInfo.pomodoroTime;
            newUser.breakTime = newInfo.breakTime;
            newUser.bigBreakTime = newInfo.bigBreakTime;

            localStorage.setItem('user', JSON.stringify(newUser));
            window.location = "/reports";

          });

        return subscribe;
      },

      async loadReports() {
        const ownerId = this.user._id;

        const result = await reportService.loadReports(ownerId);
        this.reports = result;
      },
    },
  }
</script>

<style scoped>

</style>
