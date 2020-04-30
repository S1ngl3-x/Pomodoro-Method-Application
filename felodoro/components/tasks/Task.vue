<template>
  <v-row>
    <v-card
      outlined
      @click="dialog = true"
      elevation="2"
    >
      <v-responsive width="450" class="d-md-none pa-2 ma-1">
        <v-row dense >
          <v-col class="text-no-wrap font-weight-medium" style="overflow: hidden ;text-overflow: ellipsis!important;" cols="8">
            {{name}}
          </v-col>

          <v-col class="text-no-wrap" cols="4">
            <span class="pa-auto ma-auto">
            {{pomodorosSpent}}<v-icon color="purple lighten-1">mdi-food-apple</v-icon>
            </span>
            <span v-if="pomodorosEstimated !== 0" class="pa-auto ma-auto">
            {{pomodorosEstimated}}<v-icon>mdi-food-apple-outline</v-icon>
            </span>
          </v-col>
        </v-row>
      </v-responsive>

      <v-responsive width="1000" class="d-none d-md-block pa-auto ma-auto">
        <v-row class="pa-auto ma-auto">
          <v-col cols="9" class="pa-auto ma-auto subtitle-1 font-weight-medium">
            {{name}}
          </v-col>

          <v-col class="text-no-wrap d-block pa-auto ma-auto" cols="3">
            <span class="d-block pa-auto ma-auto">
              <v-icon v-for="i in pomodorosSpent" :key="i" color="purple lighten-1">mdi-food-apple</v-icon>
            </span>
            <span v-if="pomodorosEstimated !== 0" class="d-block pa-auto ma-auto">
              <v-icon v-for="i in pomodorosEstimated" :key="i">mdi-food-apple-outline</v-icon>
            </span>
          </v-col>
        </v-row>
      </v-responsive>

      <v-dialog
        v-model="dialog"
        max-width="500"
      >
        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
            Detail
            <v-spacer/>
            <v-icon @click="dialog = false">mdi-close</v-icon>
          </v-card-title>

          <v-card-text>
            <v-text-field v-model="newName" type="text" label="newName">

              <template v-slot:append-outer>
                <v-icon v-if="newName !== name" @click="restoreName" label="submit" color="primary">mdi-backup-restore
                </v-icon>
              </template>

            </v-text-field>
            <v-list shaped>
              <v-list-item-group color="primary">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>name: {{name}}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="pomodorosEstimated !== 0">
                  <v-list-item-content>
                    <v-list-item-title>pomodoros estimated: {{pomodorosEstimated}}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="pomodorosSpent !== 0">
                  <v-list-item-content>
                    <v-list-item-title>pomodoros spent: {{pomodorosSpent}}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="selected">
                  <v-list-item-content>
                    <v-list-item-title>selected</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>


                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>status: {{status}}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>date assigned: {{dateAssignedToShow}}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="dateCreated">
                  <v-list-item-content>
                    <v-list-item-title>date created: {{dateCreatedToShow}}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="dateFinished">
                  <v-list-item-content>
                    <v-list-item-title>date finished: {{dateFinishedToShow}}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

              </v-list-item-group>
            </v-list>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions v-if='name !== "unassigned"'>
            <v-tooltip bottom>
              <template v-if='status !== "CLOSED"' v-slot:activator="{ on }">
                <v-btn v-show="!countdownRunning" v-on="on" @click="setClosed">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              Close
            </v-tooltip>

            <v-tooltip bottom>
              <template v-if='status !== "POSTPONED"' v-slot:activator="{ on }">
                <v-btn v-show="!countdownRunning" v-on="on" @click="setPostponed">
                  <v-icon>mdi-calendar-remove</v-icon>
                </v-btn>
              </template>
              Postpone
            </v-tooltip>

            <v-tooltip bottom>
              <template v-if='renewable' v-slot:activator="{ on }">
                <v-btn v-show="!countdownRunning" v-on="on" @click="renew">
                  <v-icon>mdi-autorenew</v-icon>
                </v-btn>
              </template>
              Renew - Activate task and set it to this day
            </v-tooltip>

            <v-spacer/>


            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn v-show="!countdownRunning" v-on="on" @click="rename">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              Rename
            </v-tooltip>

          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-row>
</template>

<script>
  import taskService from "./../../services/taskService";
  import {UpdateTaskStatusAndSelection, UpdateTaskStatusAndSelectionNoSub} from "./../../queries/task";
  import moment from "moment";

  export default {
    name: "task",
    props: ["_id", "name", "pomodorosSpent", "pomodorosEstimated",
      "status", "dateAssigned", "dateFinished", "dateCreated", "selected", "dailyTasks", "countdownRunning"],
    data() {
      return {
        dialog: false,
        editing: false,
        newName: this.name,
        dateAssignedToShow: moment(this.dateAssigned).format("LL"),
        dateCreatedToShow: (this.dateCreated) ? moment(this.dateCreated).format("LL") : "",
        dateFinishedToShow: (this.dateFinished) ? moment(this.dateFinished).format("LL") : "",
      }
    },

    methods: {
      async setPostponed() {
        await this.changeStatusAndDeselect("POSTPONED");
      },
      async setClosed() {
        await this.changeStatusAndDeselect("CLOSED");
      },
      async changeStatusAndDeselect(status) {
        const selected = false;
        const query = (this.selected) ? UpdateTaskStatusAndSelectionNoSub : UpdateTaskStatusAndSelection;

        const result = await this.$axios.$post("/graphql", {
          query: query,
          variables: {
            id: this._id,
            status: status,
            selected: selected,
          },
        }).catch(reason => console.log(reason));


        // select new task if was selected
        if (this.selected) {
          let newSelectedTaskId;

          for (let task of this.dailyTasks) {
            if (task._id !== this._id) {
              newSelectedTaskId = task._id;
              break;
            }
          }

          await taskService.selectTask(newSelectedTaskId);
        }

        this.dialog = false;
      },

      restoreName() {
        this.newName = this.name;
      },

      async rename() {
        if ((this.newName === this.name) || (this.newName === "")) {
          this.dialog = false;
          return;
        }

        const query = `mutation UpdateTask($id: MongoID!, $name: String){
  taskUpdateById(record: {_id: $id, name: $name}){
    record{
      _id
      name
    }
  }
}`;

        const result = await this.$axios.$post("/graphql", {
          query: query,
          variables: {
            id: this._id,
            name: this.newName,
          },
        }).catch(reason => console.log(reason));

        console.log(result);

        this.dialog = false;
      },

      async renew() {
        const newStatus = "NEW";
        const newAssignedDate = new Date();
        const dateFinished = null;
        console.log("new assigned date: " + newAssignedDate);
        const query = `mutation Renew
($id: MongoID!, $status: EnumTaskStatus, $dateAssigned: Date, $dateFinished: Date)
{
  taskUpdateById(record: {_id: $id, status: $status, dateAssigned: $dateAssigned, dateFinished: $dateFinished}){
    record{
      _id
      name
      ownerId
      status
      dateCreated
      dateAssigned
      dateFinished
    }
  }
}`;

        const result = await this.$axios.$post("/graphql", {
          query: query,
          variables: {
            id: this._id,
            status: newStatus,
            dateAssigned: newAssignedDate,
            dateFinished: dateFinished,
          },
        }).catch(reason => console.log(reason));

        console.log(result);
        this.dialog = false;
      },
    },

    computed: {
      renewable() {
        let properStatus = false;
        if (this.status === "COMPLETED" ||
          this.status === "CLOSED" ||
          this.status === "POSTPONED"
        ) {
          properStatus = true;
        }

        const assignedNotToThisDay = taskService.sameDay(new Date(this.dateAssigned), new Date());

        return properStatus || !assignedNotToThisDay;
      },
    },
  }
</script>

<style scoped>
</style>



