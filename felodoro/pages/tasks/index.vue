<template>
  <div>
    <v-container>
      <v-row justify="center">

        <v-col
          class="mb12"
          cols="12"
          md="4"
        >
          <v-skeleton-loader
            :loading="loadingOverview"
            :transition="transition"
            height="165"
            type="card"
            max-width="344"
            class="mx-auto"
          >
            <daily-overview
              :tasksDone="dailyCountTasksDone"
              :tasksUnfinished="dailyCountTasksUnfinished"
              :tasksTotal="(dailyTasks.length) -1"
              :pomodoros-done="dailyCountPomodorosDone"
              :pomodoros-estimated="dailyPomodorosEstimate"
              :time-spent="dailyTimeSpent"
            />
          </v-skeleton-loader>
        </v-col>
      </v-row>
    </v-container>

    <v-alert v-if="countdownRunning" type="warning">
      You have a running countdown. Pause the countdown before doing any changes.
    </v-alert>

    <top-task-nav
      :daily-tasks='dailyTasks.filter(t => t.status=== "NEW")'
      :all-tasks="tasks"
      :countdown-running="countdownRunning"
      :loading="loading"
    />

  </div>
</template>

<script>
  import TopTaskNav from "../../components/navigation/TopTaskNavigation";
  import FormNewTask from "../../components/forms/NewTask";
  import DailyTasks from "../../components/tasks/DailyTasks";
  import AllTasks from "../../components/tasks/AllTasks";
  import Task from "../../components/tasks/Task";
  import DailyOverview from "../../components/tasks/DailyOverview";
  import taskService from "./../../services/taskService";
  import {taskManyByIdForTasks, SubTaskCreateForTasks, SubTaskUpdateForTasks} from "./../../queries/task";
  import socket from "./../../socket/index";
  import {SubUserUpdated} from "../../queries/user";

  if (window.closed){
    socket.unsubscribeAll();
  }

  export default {
    middleware: ["first_visit", "authenticated"],
    components: {DailyOverview, Task, AllTasks, DailyTasks, FormNewTask, TopTaskNav},
    data() {
      return {
        user: null,
        tasks: [],
        dailyTasks: [],
        dailyCountTasksDone: 0,
        dailyCountTasksUnfinished: 0,
        dailyCountPomodorosDone: 0,
        dailyPomodorosEstimate: 0,
        dailyTimeSpent: 0,
        countdownRunning: null,
        loading: true,
        loadingOverview: true,
        transition: 'scale-transition',
      }
    },

    async created() {
      // if not found, then is null
      this.user = await JSON.parse(localStorage.getItem('user'));

      await this.init();


      // socket init
      socket.unsubscribeAll();
      this.subscribeForTaskCreation();
      this.subscribeForTaskUpdate();
      this.subscribeForUserUpdated();
    },

    methods: {
      async init() {
        this.loading = true;
        this.tasks = await taskService.loadTasks(this.user, taskManyByIdForTasks);
        this.dailyTasks = await taskService.getDailyTasksFromAllTasks(this.tasks);

        await this.countDailyOverview();

        const currentTask = await taskService.determineCurrentTask(this.dailyTasks);
        const currentCountdown = currentTask.countdowns[0];
        this.countdownRunning = (currentCountdown) ? currentCountdown.running : false;

        this.loading = false;
        this.loadingOverview = false;
      },

      async countDailyOverview() {
        this.dailyCountTasksDone = this.dailyTasks.filter(t => t.status === "COMPLETED").length;

        // all daily task minus the finished ones
        this.dailyCountTasksUnfinished = this.dailyTasks.length - this.dailyCountTasksDone - 1; // minus 1 because "unassigned" task is never finished


        this.dailyPomodorosEstimate = this.dailyTasks.reduce((sum, task) => sum + task.pomodorosEstimated, 0);

        const today = new Date();

        let dailyFinishedPomodoros = this.dailyTasks.map(task => task.pomodorosSpent) // get pomodoros from all daily tasks
          .filter(pomodoros => pomodoros.length !== 0); // remove arrays with no completed pomodoros
        dailyFinishedPomodoros = [].concat(...dailyFinishedPomodoros) // move all pomodoros to one array (transform 2D into 1D array)
          .filter(pomodoro => taskService.sameDay(today, new Date(pomodoro.date)));  // remove pomodoros, that have not been completed today

        this.dailyCountPomodorosDone = dailyFinishedPomodoros.length;

        this.dailyTimeSpent = dailyFinishedPomodoros
          .reduce((sum, pomodoro) => sum + pomodoro.timeTotal.minutes, 0);// sum of all minutes spent on completed pomodoros
      },

      subscribeForTaskCreation(){
        const query = SubTaskCreateForTasks(this.user._id);

        const subscribe = socket.request({query},{
        })
          .subscribe(async () => {
            await this.init();
          });

        return subscribe;
      },

      subscribeForTaskUpdate(){
        const query = SubTaskUpdateForTasks(this.user._id);

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
            window.location = "/tasks";

          });

        return subscribe;
      },

    },

  }
</script>

<style scoped>
</style>
