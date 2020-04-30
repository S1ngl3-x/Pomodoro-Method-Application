<template>
  <div>
    <form-new-task v-show="!countdownRunning" :loading="loading"/>
    <big-circular-loader v-if="stillLoading" :size="200"/>

    <span v-for="task in dailyTasks" :key="task._id" v-if="!$vuetify.breakpoint.xlOnly">
              <v-row>

                <v-col cols="2" class="mt-3">
                  <v-tooltip left v-if='task.name !== "unassigned"' :disabled="checkIfMobile()">
                  <template v-slot:activator="{on}">
                    <v-btn icon fab outlined
                           :x-small="$vuetify.breakpoint.smAndDown"
                           :small="$vuetify.breakpoint.mdAndUp"
                           v-show="!countdownRunning" v-on="on" @click="complete(task)"
                           color="green">
                                  <v-scroll-x-transition>
              <v-icon
                v-if="task.beCompleted"
                color="success"
              >
                mdi-check
              </v-icon>
            </v-scroll-x-transition>
                    </v-btn>
                  </template>
                  Complete task
                </v-tooltip>

                <v-btn v-if='countdownRunning || task.name === "unassigned" ' outlined disabled icon fab
                       :x-small="$vuetify.breakpoint.smAndDown"
                       :small="$vuetify.breakpoint.mdAndUp"
                >
              </v-btn>
                </v-col>

                <v-col cols="8">
                  <task
                    :_id="task._id"
                    :name="task.name"
                    :pomodoros-spent="task.pomodorosSpentCount"
                    :pomodoros-estimated="task.pomodorosEstimated"
                    :status="task.status"
                    :date-assigned="task.dateAssigned"
                    :date-finished="task.dateFinished"
                    :date-created="task.dateCreated"
                    :selected="task.selected"
                    :daily-tasks="dailyTasks"
                    :countdown-running="countdownRunning"
                  />
                </v-col>

                <v-col cols="2" class="mt-3 d-flex justify-end">

                   <v-tooltip right :disabled="checkIfMobile()">
                  <template v-slot:activator="{on}">
                    <v-btn icon fab outlined v-on="on" v-show="!task.selected && !countdownRunning"
                           :x-small="$vuetify.breakpoint.smAndDown"
                           :small="$vuetify.breakpoint.mdAndUp"
                           :color='task.beLoaded ? "indigo" : "grey"'
                           @click="changeTask(task._id, task)"
                           :loading="task.beLoaded"
                    >
                      <v-icon>mdi-play</v-icon>
                    </v-btn>
                  </template>
                  Select task
                </v-tooltip>

                <v-tooltip right :disabled="checkIfMobile()">
                  <template v-slot:activator="{on}">
                    <v-btn fab :color='taskSwitching ? "grey " : "indigo"'
                           :x-small="$vuetify.breakpoint.smAndDown"
                           :small="$vuetify.breakpoint.mdAndUp"
                           v-on="on"
                           v-show="task.selected"
                           :outlined="!!taskSwitching"
                    >
                      <v-icon :color='taskSwitching ? "" : "white"'>mdi-play</v-icon>
                    </v-btn>
                  </template>
                  Task is already selected
                </v-tooltip>
                </v-col>
              </v-row>
            </span>

    <span v-for="task in dailyTasks" :key="task._id" v-if="$vuetify.breakpoint.xlOnly">
              <v-row class="ma-auto">

                <v-col cols="2" class="mt-3 d-flex justify-center">
                  <v-tooltip left v-if='task.name !== "unassigned"' :disabled="checkIfMobile()">
                  <template v-slot:activator="{on}">
                    <v-btn icon fab outlined
                           :x-small="$vuetify.breakpoint.smAndDown"
                           :small="$vuetify.breakpoint.mdAndUp"
                           v-show="!countdownRunning" v-on="on" @click="complete(task)"
                           color="green">
                                  <v-scroll-x-transition>
              <v-icon
                v-if="task.beCompleted"
                color="success"
              >
                mdi-check
              </v-icon>
            </v-scroll-x-transition>
                    </v-btn>
                  </template>
                  Complete task
                </v-tooltip>

                <v-btn v-if='countdownRunning || task.name === "unassigned" ' outlined disabled icon fab
                       :x-small="$vuetify.breakpoint.smAndDown"
                       :small="$vuetify.breakpoint.mdAndUp"
                >
              </v-btn>
                </v-col>

                <v-col cols="8" class="d-flex justify-center flex-shrink-1">
                  <task
                    :_id="task._id"
                    :name="task.name"
                    :pomodoros-spent="task.pomodorosSpentCount"
                    :pomodoros-estimated="task.pomodorosEstimated"
                    :status="task.status"
                    :date-assigned="task.dateAssigned"
                    :date-finished="task.dateFinished"
                    :date-created="task.dateCreated"
                    :selected="task.selected"
                    :daily-tasks="dailyTasks"
                    :countdown-running="countdownRunning"
                    class="d-flex justify-center"
                  />
                </v-col>

                <v-col cols="2" class="mt-3 d-flex justify-center">

                   <v-tooltip right :disabled="checkIfMobile()">
                  <template v-slot:activator="{on}">
                    <v-btn icon fab outlined v-on="on" v-show="!task.selected && !countdownRunning"
                           :x-small="$vuetify.breakpoint.smAndDown"
                           :small="$vuetify.breakpoint.mdAndUp"
                           :color='task.beLoaded ? "indigo" : "grey"'
                           @click="changeTask(task._id, task)"
                           :loading="task.beLoaded"
                    >
                      <v-icon>mdi-play</v-icon>
                    </v-btn>
                  </template>
                  Select task
                </v-tooltip>

                <v-tooltip right :disabled="checkIfMobile()">
                  <template v-slot:activator="{on}">
                    <v-btn fab :color='taskSwitching ? "grey " : "indigo"'
                           :x-small="$vuetify.breakpoint.smAndDown"
                           :small="$vuetify.breakpoint.mdAndUp"
                           v-on="on"
                           v-show="task.selected"
                           :outlined="!!taskSwitching"
                    >
                      <v-icon :color='taskSwitching ? "" : "white"'>mdi-play</v-icon>
                    </v-btn>
                  </template>
                  Task is already selected
                </v-tooltip>
                </v-col>
              </v-row>
            </span>
  </div>
</template>

<script>
  import FormNewTask from "../forms/NewTask";
  import Task from "./Task";
  import taskService from "./../../services/taskService";
  import BigCircularLoader from "../loaders/BigCircularLoader";
  import {isMobile} from "mobile-device-detect";

  export default {
    name: "daily-tasks",
    components: {Task, FormNewTask, BigCircularLoader},
    props: ["tasks", "countdownRunning", "loading"],
    data() {
      return {
        transition: 'scale-transition',
        loaded: false,
      }
    },

    methods: {
      async complete(task) {
        if (this.loading) return;
        task.beCompleted = true;
        await taskService.completeTask(task._id, task.selected, this.tasks);
      },

      async changeTask(_id, task) {
        if (this.loading) return;
        task.beLoaded = true;
        await taskService.changeSelectedTask(_id, this.tasks);
      },

      checkIfMobile() {
        return isMobile;
      },

    },
    computed: {
      dailyTasks() {
        return this.tasks;
      },

      stillLoading() {
        let result = false;
        if (!this.loaded) {
          this.loaded = true;
          result = this.loading;
        }

        return result;
      },

      taskSwitching() {
        return this.loading && this.tasks.some(task => task.beLoaded);
      }
    },
  }
</script>

<style scoped>
</style>
