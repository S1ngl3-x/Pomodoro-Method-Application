<template>
  <v-form>
    <v-responsive max-width="1250" class="mx-auto">
      <v-row>
        <v-col cols="12">
        <form v-on:submit.prevent @submit="createTask">
            <v-text-field
              v-model="taskName"
              outlined
              clearable
              label="Add Task"
              type="text"
              tabindex="1"
              :loading="loading"
            >
              <template v-slot:prepend>
                <v-icon>mdi-clipboard-list-outline</v-icon>
              </template>

              <template v-slot:append>
                <v-menu
                  transition="scale-transition"
                  bottom
                  right
                >
                  <template v-slot:activator="{ on: menu }">

                    <v-tooltip top>
                      <template v-slot:activator="{ on: tooltip }">

                        <v-icon tabindex="2" v-on="{ ...tooltip, ...menu }">mdi-food-apple-outline</v-icon>
                        {{pomodorosEstimated}}

                      </template>
                      How many pomodoros would it take?
                    </v-tooltip>

                  </template>

                  <v-list>
                    <v-list-item
                      v-for="(item, i) in items"
                      :key="i"
                      @click="setPomodoroEstimation(i)"
                    >
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
              <template v-slot:append-outer>
                <v-btn icon fab dark v-if="taskName && !loading"
                       type="submit" label="submit" color="primary"
                       tabindex="3"
                       class="pb-10"
                >
                  <v-icon large>mdi-plus-thick</v-icon>
                </v-btn>

                <v-btn icon fab dark v-if="!taskName"
                       color="grey lighten-2"
                       class="pb-10"
                >
                  <v-icon large>mdi-plus-thick</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </form>
        </v-col>
      </v-row>
    </v-responsive>
  </v-form>
</template>

<script>
  export default {
    name: "form-new-task",
    props: ["loading"],
    data: () => ({
      taskName: "",
      items: [
        {title: 0},
        {title: 1},
        {title: 2},
        {title: 3},
        {title: 4},
        {title: 5},
        {title: 6},
        {title: 7},
      ],
      pomodorosEstimated: null,
    }),

    methods: {
      setPomodoroEstimation(number) {
        this.pomodorosEstimated = number;
      },
      async createTask() {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!this.taskName || this.taskName === "" || !user) return; //for convenience sake

        const name = this.taskName;
        const estimate = this.pomodorosEstimated ? this.pomodorosEstimated : 0;
        const ownerId = user._id;
        const date = new Date();

        const query = `mutation CreateTask(
  $name: String!,
  $ownerId: MongoID!,
  $estimate: Float,
  $date: Date
){
  taskCreateOne(record: {
    name: $name,
    ownerId: $ownerId,
    pomodorosEstimated: $estimate,
    dateAssigned: $date,
    dateCreated: $date,
  }){
    record {
      name
      pomodorosEstimated
      selected
      status
      dateCreated
      dateAssigned
      dateFinished
      _id
      ownerId
    }
  }
}
        `;

        const result = await this.$axios.$post("/graphql", {
          query: query,
          variables: {
            name: name,
            ownerId: ownerId,
            estimate: estimate,
            date: date,
          }
        }).catch(reason => console.log(reason));

        //refresh form state
        this.taskName = "";
        this.pomodorosEstimated = null;
      },
      async createSelectedPomodoroForTask(taskId) {
        const ownerId = taskId;
        const type = "POMODORO";
        const totalMinutes = 25;
        const currentMinutes = 25;
        const selected = true;

        const query = `mutation CreateCountdown($ownerId: MongoID!,  $type: EnumCountdownType!
        ,$totalMinutes: Float, $currentMinutes: Float, $selected: Boolean){
  countdownCreateOne(record: {
    timeTotal:{minutes: $totalMinutes},
    timeCurrent:{minutes: $currentMinutes},
    type: $type,
    ownerId: $ownerId,
    selected: $selected
  }) {
    record {
      timeTotal {
        minutes
        seconds
      }
      timeCurrent {
        minutes
        seconds
      }
      selected
      running
      date
      ownerId
      _id
    }
  }
}`;
        const result = await this.$axios.$post("/graphql", {
          query: query,
          variables: {
            ownerId: ownerId,
            type: type,
            totalMinutes: totalMinutes,
            currentMinutes: currentMinutes,
            selected: selected,
          },
        }).catch(reason => console.log(reason));
      },
    },
  }
</script>

<style scoped>
</style>
