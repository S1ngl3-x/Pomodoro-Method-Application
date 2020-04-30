<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>

      <v-container class="lighten-5 mt-0 pt-0 mb-0 pb-0">

        <v-row class="mt-0 pt-0 mb-0 pb-0" dense>

          <v-col cols="2" class="mt-3 d-flex justify-center">
            <v-tooltip left v-if='taskName !== "unassigned"' :disabled="checkIfMobile()">
              <template v-slot:activator="{on}">
                <v-btn icon fab outlined
                       :x-small="$vuetify.breakpoint.smAndDown"
                       :small="$vuetify.breakpoint.mdAndUp"
                       v-show="!running" v-on="on" @click="complete"
                       color="green">
                  <v-scroll-x-transition>
                    <v-icon
                      v-if="beCompleted"
                      color="success"
                    >
                      mdi-check
                    </v-icon>
                  </v-scroll-x-transition>
                </v-btn>
              </template>
              Complete task
            </v-tooltip>
            <v-btn v-if='running || taskName === "unassigned" ' outlined disabled icon fab
                   :x-small="$vuetify.breakpoint.smAndDown"
                   :small="$vuetify.breakpoint.mdAndUp"
            >
            </v-btn>
          </v-col>


          <v-col cols="8">
            <task
              :_id="ownerId"
              :name="taskName"
              :pomodoros-spent="pomodorosSpentCount"
              :pomodoros-estimated="pomodorosEstimated"
              :status="taskStatus"
              :date-assigned="taskDateAssigned"
              :date-finished="taskDateFinished"
              :date-created="taskDateCreated"
              :selected="taskSelected"
              :countdown-running="running"
              :daily-tasks="dailyTasks"
            />
          </v-col>


          <v-col cols="2" class="mt-1 d-flex justify-center">
            <v-menu
              offset-y
              transition="slide-y-transition"
              bottom
            >
              <template v-slot:activator="{ on: menu }" v-if="!running">

                <v-tooltip top :disabled="checkIfMobile()">
                  <template v-slot:activator="{ on: tooltip }">

                    <v-btn icon fab color="primary" v-on="{ ...tooltip, ...menu }"
                    >
                      <v-icon
                        :large="$vuetify.breakpoint.smAndDown"
                        :x-large="$vuetify.breakpoint.mdAndUp"
                      >mdi-clipboard-list</v-icon>
                    </v-btn>

                  </template>
                  Choose different task
                </v-tooltip>

              </template>

              <v-list>
                <v-list-item
                  v-for="(item, i) in dailyTasks"
                  :key="i"
                  @click="changeTask(item._id)"
                >
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-tooltip top v-if="running" :disabled="checkIfMobile()">
              <template v-slot:activator="{ on: tooltip }">
                <v-btn icon fab color="grey" class="noFocus" v-on="{ ...tooltip}">
                  <v-icon large>mdi-clipboard-list</v-icon>
                </v-btn>
              </template>
              Cannot switch task during pomodoro
            </v-tooltip>
          </v-col>


        </v-row>
      </v-container>


      <v-container>
        <v-row justify="center">

          <v-progress-circular
            :rotate="-90"
            :size="350"
            :width="25"
            :value="value"
            :color='(type === "POMODORO") ? "primary" :  "#d79f8c"'
          >
            <div>
              <v-row justify="center">
                <span class="display-4">{{displayedMinutes}}:{{displayedSeconds}}</span> <br>
              </v-row>
              <v-row justify="center" class="headline font-weight-medium">
                {{type}}
              </v-row>
            </div>
          </v-progress-circular>
        </v-row>

      </v-container>


      <v-row justify="center">

        <v-btn v-if="!_id" @click="createNewCountdown"
               :color='(type === "POMODORO") ? "primary" :  "#d79f8c"'
               elevation="8"
        >
          START
        </v-btn>
        <v-btn  v-if="_id && running === false" @click="updateTimer(true)">RESUME</v-btn>
        <v-btn  v-if="_id && running === true" @click="updateTimer(false)">PAUSE</v-btn>
      </v-row>

      <v-row justify="center" class="mt-5">

        <v-btn @click="resetPomodoro" x-small v-if='_id && running === false && type === "POMODORO"'>reset pomodoro
        </v-btn>

        <v-btn @click="skipBreak" x-small v-if='_id && running === false && type === "BREAK"'>skip break</v-btn>

      </v-row>



<!--      <button v-if="_id" @click="completeTimer">COMPLETE NOW</button>-->



    </v-flex>
  </v-layout>
</template>

<script>
  import Timer from 'easytimer.js';
  import taskService from "../services/taskService";
  import socket from "../socket";
  import {SubscribeForCountdownGetUpdate} from "../queries/countdown";
  import Task from "./tasks/Task";
  import {isMobile} from "mobile-device-detect";

  export default {
    name: "pomodoro-timer",
    components: {Task},
    props: ["_id", "timeCurrent", "timeTotal", "selected", "running", "date", "bigBreakTime",
      "type", "ownerId", "taskName", "pomodoroTime", "breakTime", "pomodorosSpentCount", "dailyTasks", "pomodorosEstimated",
      "taskStatus", "taskDateAssigned", "taskDateFinished", "taskDateCreated", "taskSelected"
    ],
    data() {
      return {
        timer: null,
        getUpdateSubscription: null,
        user: null,
        displayedMinutes: null,
        displayedSeconds: null,
        min: 25,
        active: false,
        beCompleted: false,
        value: 0,

        handleTick: () => {
          this.updateCountdown();
        },
        handleFinish: async () => {
          await this.completeTimer();
        },

        soundBegin: new Audio("../sound_begin.mp3"),
        soundEnd: new Audio("../sound_end.mp3"),
      }
    },

    async created() {
      this.timer = new Timer();
      this.timer.removeEventListener('secondsUpdated', this.handleTick);
      this.timer.removeEventListener('targetAchieved', this.handleFinish);


      this.timer.addEventListener('secondsUpdated', this.handleTick);
      this.timer.addEventListener('targetAchieved', this.handleFinish);


      if (this.running) {
        this.startCountdown();
        window.onbeforeunload = () => {
          // this.updateTimer(false); // if want to always stop time when leaving and preserve stability, but cause unwanted pause on tab close/reload
          socket.unsubscribeAll(); // remove subs after close

          return "Stop countdown before leaving!";
        }
      } else {
        window.onbeforeunload = () => null;
      }

      if (this.running) {
        setTimeout(this.subscribeForCountdownGetUpdate, 5000);
      }

      this.user = await JSON.parse(localStorage.getItem('user'));

      this.computeDisplayedMinutes();
      this.computeDisplayedSeconds();
      this.value = this.computeProgress();
    },

    beforeDestroy() {
      this.timer.removeEventListener('secondsUpdated', this.handleTick);
      this.timer.removeEventListener('targetAchieved', this.handleFinish);
      this.timer = null;
    },

    methods: {
      async complete() {
        this.beCompleted = true;
        await taskService.completeTask(this.ownerId, this.selected, this.dailyTasks);
      },

      async changeTask(_id) {
        await taskService.changeSelectedTask(_id, this.dailyTasks);
      },

      async updateTimer(running) {
        const _id = this._id;
        const minutes = this.timeCurrent.minutes;
        const seconds = this.timeCurrent.seconds;

        const query = `mutation UpdateCountdown(
  $_id: MongoID!,
  $running: Boolean,
  $minutes: Float,
  $seconds: Float,
){
  countdownUpdateById(record: {
    _id: $_id,
    running: $running,
    timeCurrent: {
      minutes:  $minutes,
      seconds: $seconds,
    }}) {
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
      type
      ownerId
      _id
    }
  }
}`;
        const result = await this.$axios.$post("graphql", {
          query: query,
          variables: {
            _id: _id,
            running: running,
            minutes: minutes,
            seconds: seconds,
          },
        }).catch(reason => console.log(reason));
      },

      updateCountdown() {
        this.timeCurrent.minutes = this.timer.getTimeValues().minutes;
        this.timeCurrent.seconds = this.timer.getTimeValues().seconds;

        this.computeDisplayedMinutes();
        this.computeDisplayedSeconds();

        this.value = this.computeProgress();
      },

      startCountdown() {
        this.timer.start({countdown: true, target: {minutes: 0, seconds: 0}, startValues: this.timeCurrent});
        this.updateCountdown();
      },

      async completeTimer() {
        this.playSound();

        await this.timer.stop();
        await this.updateCountdown();
        await this.endCountdown();
      },


      async endCountdown() {

        const _id = this._id;
        const query = `mutation endCountdown($_id: MongoID!) {
  countdownUpdateById(record: {
    _id: $_id,
    running: false,
    selected: false,
    timeCurrent: {
      minutes: 0,
      seconds: 0,
    },
  }) {
    record {
    _id
      timeTotal {
        minutes
      }
      timeCurrent {
        minutes
      }
      selected
      running
      type
    }
  }
}`;
        const result = await this.$axios.$post("/graphql", {
          query: query,
          variables: {
            _id: _id,
          },
        }).catch(reason => console.log(reason));

        return result.data.countdownUpdateById.record.type;
      },

      async createNewCountdown() {
        const selected = this.selected;
        const running = true;
        const type = this.type;
        const timeTotal = this.timeTotal;
        const timeCurrent = this.timeCurrent;
        const ownerId = this.ownerId;

        const query = `mutation CreateCountdown(
  $selected: Boolean,
  $running: Boolean,
  $type: EnumCountdownType!,
  $timeTotal: CountdownTimeTotalInput!,
  $timeCurrent: CountdownTimeTotalInput!,
  $ownerId: MongoID!,
){
  countdownCreateOne(record: {
    selected: $selected,
    running: $running,
    type: $type,
    timeTotal: $timeTotal,
    timeCurrent: $timeCurrent,
    ownerId: $ownerId,
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
            selected: selected,
            running: running,
            type: type,
            timeTotal: timeTotal,
            timeCurrent: timeCurrent,
            ownerId: ownerId,
          },
        }).catch(reason => console.log(reason));

      },

      async resetPomodoro() {
        this.timeCurrent.minutes = this.user.pomodoroTime;
        this.timeCurrent.seconds = 0;
        await this.updateTimer(false);
      },

      subscribeForCountdownGetUpdate() {
        const query = SubscribeForCountdownGetUpdate(this.ownerId);

        this.getUpdateSubscription = socket.request({query})
          .subscribe(async () => {
            await this.updateTimer(this.running);
          });

        return true;
      },

      async skipBreak() {
        this.timer.pause();

        const _id = this._id;
        const query = `mutation endCountdown($_id: MongoID!) {
  countdownUpdateById(record: {
    _id: $_id,
    running: false,
    selected: false,
  }) {
    record {
    _id
      timeTotal {
        minutes
      }
      timeCurrent {
        minutes
      }
      selected
      running
      type
    }
  }
}`;
        const result = await this.$axios.$post("/graphql", {
          query: query,
          variables: {
            _id: _id,
          },
        }).catch(reason => console.log(reason));

        return result.data.countdownUpdateById.record.type;
      },

      getSeconds(minutes, seconds) {
        return (minutes * 60) + seconds;
      },

      computeProgress() {
        let total = this.getSeconds(this.timeTotal.minutes, this.timeTotal.seconds);
        let current = this.getSeconds(this.timeCurrent.minutes, this.timeCurrent.seconds);
        const percentageLeft = (current / total) * 100;
        return 100 - percentageLeft;
      },

      computeDisplayedMinutes() {
        this.displayedMinutes = (this.timeCurrent.minutes.toString().length === 1) ? "0".concat(this.timeCurrent.minutes) : this.timeCurrent.minutes;
      },

      computeDisplayedSeconds() {
        this.displayedSeconds = (this.timeCurrent.seconds.toString().length === 1) ? "0".concat(this.timeCurrent.seconds) : this.timeCurrent.seconds;
      },

      checkIfMobile() {
        return isMobile;
      },

      playSound() {
        let sounds = JSON.parse(localStorage.getItem("sounds"));
        if (sounds !== null && sounds === false) return;

        if (this.type === "POMODORO"){
          this.playSoundEnd();
        } else {
          this.playSoundBegin();
        }
      },

      playSoundBegin() {
        this.soundBegin.play();
      },

      playSoundEnd() {
        this.soundEnd.play();
      },
    },
  }
</script>

<style scoped>

  .noFocus {
    cursor: default;
  }
</style>

