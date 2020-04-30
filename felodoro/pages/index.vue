<template>
  <div class="d-flex justify-center">
    <big-circular-loader class="mt-8" v-if="!display" :size="350"/>

    <pomodoro-timer v-if="display"
                    :_id="selectedCountdown ? selectedCountdown._id : null"
                    :owner-id="selectedTask._id"
                    :task-name="selectedTask.name"
                    :time-current="selectedCountdown ? selectedCountdown.timeCurrent : newCountdown.timeCurrent"
                    :time-total="selectedCountdown ? selectedCountdown.timeTotal : newCountdown.timeTotal"
                    :selected="selectedCountdown ? selectedCountdown.selected : newCountdown.selected"
                    :running="selectedCountdown ? selectedCountdown.running : newCountdown.running"
                    :date="selectedCountdown ? selectedCountdown.date : null"
                    :type="selectedCountdown ? selectedCountdown.type : newCountdown.type"
                    :pomodoro-time="user.pomodoroTime"
                    :break-time="user.breakTime"
                    :pomodoros-spent-count="selectedTask.pomodorosSpentCount"
                    :big-break-time="user.bigBreakTime"
                    :pomodoros-estimated="selectedTask.pomodorosEstimated"
                    :daily-tasks="dailyTasks"
                    :task-status="selectedTask.status"
                    :task-date-assigned="selectedTask.dateAssigned"
                    :task-date-finished="selectedTask.dateFinished"
                    :task-date-created="selectedTask.dateCreated"
                    :task-selected="selectedTask.selected"
                    class="disable-dbl-tap-zoom"/>

  </div>
</template>

<script>
  import PomodoroTimer from "../components/PomodoroTimer";
  import UserMenu from "../components/menus/UserMenu";
  import taskService from "./../services/taskService";
  import socket from "./../socket/index";
  import {SubTaskCreateForHome, taskManyByIdForHome, SubTaskUpdateForHome} from "./../queries/task";
  import {SubCountdownUpdated, SubCountdownCreated} from "./../queries/countdown";
  import {SubUserUpdated} from "./../queries/user"
  import BigCircularLoader from "../components/loaders/BigCircularLoader";


  export default {
    middleware: ["first_visit", "authenticated"],
    components: {
      UserMenu,
      PomodoroTimer,
      BigCircularLoader,
    },
    data() {
      return {
        user: null,
        dailyTasks: [],
        selectedTask: null,
        selectedCountdown: null,
        newCountdown: null,
        display: false,




        transition: 'scale-transition',
      }
    },

    async created() {
      this.user = await JSON.parse(localStorage.getItem('user'));

      await this.init();

      if (this.selectedCountdown){
        if (this.selectedCountdown.running === true){
          await this.countdownGetUpdate();
        }
      }


    },
    methods: {
      async init() {
        socket.unsubscribeAll();
        this.display = false;
        this.selectedCountdown = null;


        this.dailyTasks = await taskService.loadTasks(this.user, taskManyByIdForHome);



        // set up page
        this.selectedTask = await taskService.determineCurrentTask(this.dailyTasks);


        // todo remove later, this is just temporary solution
        if (!this.selectedTask) {
          this.dailyTasks = await taskService.loadTasks(this.user, taskManyByIdForHome);
          this.selectedTask = await taskService.determineCurrentTask(this.dailyTasks);
        }

        if (this.selectedTask.countdowns.length === 0 || !this.selectedTask.countdowns[0].selected) {
          this.newCountdown = await this.prepareCountdown();
        } else if (this.selectedTask.countdowns[0].selected === true) {
          this.selectedCountdown = this.selectedTask.countdowns[0];
        }

        this.display = true;

        // socket.unsubscribeAll();
        this.subscribeForTaskCreation();
        this.subscribeForTaskUpdate();
        this.subscribeForCountdownUpdate();
        this.subscribeForCountdownCreation();
        this.subscribeForUserUpdated();

      },

      async prepareCountdown() {
        const type = this.getNewCountdownType();
        const minutes = this.getCountdownLength(type);
        const newCountdown = {
          selected: true,
          running: false,
          type: type,
          timeTotal: {
            minutes: minutes,
            seconds: 0,
          },
          timeCurrent: {
            minutes: minutes,
            seconds: 0,
          },
          ownerId: this.selectedTask._id,
        };

        return newCountdown;
      },

      getNewCountdownType() {
        const lastTask = this.selectedTask.countdowns[0];
        if (!lastTask) return "POMODORO";
        return (lastTask.type === "POMODORO") ? "BREAK" : "POMODORO";
      },

      getCountdownLength(type) {
        if (type === "POMODORO") return this.user.pomodoroTime;
        const timeForBigBreak = (this.selectedTask.pomodorosSpentCount % 4 === 0) && (this.selectedTask.pomodorosSpentCount !== 0);
        return timeForBigBreak ? this.user.bigBreakTime : this.user.breakTime;
      },

      async countdownGetUpdate() {
        const query = `query CountdownGetUpdate($_id: MongoID!){
  countdownGetUpdate(filter: {_id: $_id}){
    selected
    running
    type
    date
    ownerId
    _id
  }
}`;
        const result = await this.$axios.$post("/graphql", {
          query: query,
          variables: {
            _id: this.selectedCountdown._id,
          },
        }).catch(reason => console.log(reason));
      },

      subscribeForTaskCreation() {
        const query = SubTaskCreateForHome(this.user._id);

        const subscribe = socket.request({query})
          .subscribe(async () => {
            await this.init();
          });

        return subscribe;
      },

      subscribeForTaskUpdate() {
        const query = SubTaskUpdateForHome(this.user._id);

        const subscribe = socket.request({query})
          .subscribe(async () => {
            await this.init();
          });

        return subscribe;
      },

      subscribeForCountdownUpdate() {
        const query = SubCountdownUpdated(this.selectedTask._id);

        const subscribe = socket.request({query})
          .subscribe(async (payload) => {
            if (payload.data.countdownUpdated.timeCurrent.seconds === 0
            && payload.data.countdownUpdated.timeCurrent.seconds === 0){
              this.sendPushNotification();
            }


            await this.init();
          });

        return subscribe;
      },

      subscribeForCountdownCreation() {
        const query = SubCountdownCreated(this.selectedTask._id);

        const subscribe = socket.request({query})
          .subscribe(async () => {
            await this.init();
          });

        return subscribe;
      },

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
            window.location = "/";

          });

        return subscribe;
      },

      async sendPushNotification() {
        this.$OneSignal.push(async () => {
          this.$OneSignal.sendSelfNotification(
            "Countdown ended",
            "Your countdown has ended",
          );
        });
      },
    },

  }
</script>

<style scoped>
  .disable-dbl-tap-zoom {
    touch-action: manipulation;
  }
</style>
