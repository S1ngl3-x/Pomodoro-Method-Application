<template>
  <div>
      <v-list-item-title class="subtitle-1 font-weight-medium">Filters:</v-list-item-title>
      <v-row justify="space-around">

        <v-switch class="d-flex flex-shrink-1" v-model="descending" label="DESCENDING" color="purple"></v-switch>

        <v-col class="d-flex flex-shrink-0"
               :cols='$vuetify.breakpoint.xsOnly ? 5 : 3'
        >
          <v-select
            :items="statusItems"
            label="STATUS"
            solo
            clearable
            v-model="selectedStatus"
            class="flex-shrink-0"
          ></v-select>
        </v-col>

      </v-row>

    <span v-for="task in tasksToDisplay" :key="task._id">
      <v-chip
        v-if="task.displayDate"
        class="ma-2"
        color="indigo darken-3"
        outlined
      >
      <v-icon left>mdi-calendar-today</v-icon>
      {{parseDate(task.dateAssigned)}}
    </v-chip>
      <v-row v-if="!$vuetify.breakpoint.xlOnly">

        <v-col cols="9">

                  <task :_id="task._id"
                        :name="task.name"
                        :pomodoros-spent="task.pomodorosSpentCount"
                        :pomodoros-estimated="task.pomodorosEstimated"
                        :status="task.status"
                        :date-assigned="task.dateAssigned"
                        :date-finished="task.dateFinished"
                        :date-created="task.dateCreated"
                        :selected="task.selected"
                        :countdown-running="countdownRunning"
                  />
        </v-col>

        <v-col cols="3" class="mx-auto">
          <v-chip disabled v-if="task.selected">
            <v-tooltip right>
                <template v-slot:activator="{on}">
                  <v-icon v-on="on" v-if="task.selected" color="indigo">mdi-play-circle-outline</v-icon>
                </template>
          Task is selected
              </v-tooltip>
                    </v-chip>

        <v-chip disabled>
        <v-icon>
          {{task.icon}}
        </v-icon>
        </v-chip>
        </v-col>


      </v-row>

      <v-row class="ma-auto pa-auto d-flex justify-center" v-if="$vuetify.breakpoint.xlOnly">

        <v-col class="d-flex justify-end" cols="8">

                  <task :_id="task._id"
                        :name="task.name"
                        :pomodoros-spent="task.pomodorosSpentCount"
                        :pomodoros-estimated="task.pomodorosEstimated"
                        :status="task.status"
                        :date-assigned="task.dateAssigned"
                        :date-finished="task.dateFinished"
                        :date-created="task.dateCreated"
                        :selected="task.selected"
                        :countdown-running="countdownRunning"
                  />
        </v-col>

        <v-col cols="1">
                  <v-chip disabled>
        <v-icon>
          {{task.icon}}
        </v-icon>
        </v-chip>
          <v-chip disabled v-if="task.selected">
            <v-tooltip right>
                <template v-slot:activator="{on}">
                  <v-icon v-on="on" v-if="task.selected" color="indigo">mdi-play-circle-outline</v-icon>
                </template>
          Task is selected
              </v-tooltip>
                    </v-chip>
        </v-col>

      </v-row>
    </span>
  </div>
</template>

<script>
  import Task from "./Task";
  import taskService from "./../../services/taskService";
  import moment from "moment";

  export default {
    name: "all-tasks",
    components: {Task},
    props: ["tasks", "countdownRunning"],
    data() {
      return {
        descending: true,
        lastDate: "",
        statusItems: ["NEW", "COMPLETED", "CLOSED", "POSTPONED"],
        selectedStatus: null,
      }
    },
    computed: {
      tasksToDisplay() {
        let temp = [...this.tasks];

        if (!this.descending) temp.reverse();

        if (this.selectedStatus){
          temp = temp.filter(task => task.status === this.selectedStatus)
        }

        this.lastDate = "";
        for (let task of temp) {
          // determine, whether date should be displayed (if previous tasks had different date assigned)
          task.displayDate = this.newDay(task.dateAssigned);

          // add icon to be displayed according to task's status
          task.icon = this.setIcon(task.status);
        }

        return temp;
      },
    },

    methods: {
      newDay(day) {
        const newDay = new Date(day);
        if (this.lastDate !== "" && taskService.sameDay(this.lastDate, newDay)) {
          return false;
        }
        this.lastDate = newDay;
        return true;
      },

      setIcon(status) {
        let icon = "";
        switch (status) {
          case "NEW":
            icon = "mdi-progress-clock";
            break;
          case "COMPLETED":
            icon = "mdi-check";
            break;
          case "CLOSED":
            icon = "mdi-close-octagon";
            break;
          case "POSTPONED":
            icon = "mdi-calendar-remove";
            break;
        }
        return icon;
      },

      parseDate(date) {
        return moment(date).format("LL");
      },
    },
  }
</script>

<style scoped>
</style>
