<template>
  <v-app light ontouchstart="" >
    <top-navigation v-if="!checkIfMobile()" :user="user" :logged="logged"/>

    <top-mobile-navigation v-if="checkIfMobile()" :user="user" :logged="logged" />

    <v-content>
      <v-container class="mt-1 pt-2">
        <nuxt />
      </v-container>
    </v-content>

    <bottom-nav v-if="checkIfMobile()"/>
  </v-app>
</template>

<script>
  import BottomNav from "../components/navigation/BottomNav";
  import UserMenu from "../components/menus/UserMenu";
  import TopNavigation from "../components/navigation/TopNavigation";
  import TopMobileNavigation from "../components/navigation/TopMobileNavigation";
  import taskService from "../services/taskService";
  import {taskManyByIdForTasks} from "../queries/task";
  import {isMobile} from "mobile-device-detect";

  export default {
    components: {UserMenu, BottomNav, TopNavigation, TopMobileNavigation},
    data() {
      return {
        user: null,
        logged: false,
        email: "",
        display: false,
      }
    },

    async mounted() {
      this.user = await JSON.parse(localStorage.getItem('user'));
      const axioUrl = "http://" + location.host.toString() + "/graphql"; // http for localhost
      // const axioUrl = "https://" + location.host.toString() + "/graphql"; // https
      this.$axios.setBaseURL(axioUrl);

      if (!this.userInLocalStorage) return;

      // if validated today
      const today = new Date();

      if (!taskService.sameDay(today, new Date(this.user.validationDate))){
        await this.validate(today);
      }

      this.email = this.user.email;
      this.logged = true;
      this.display = true;
    },

    computed: {
      userInLocalStorage() {
        return JSON.parse(localStorage.getItem('user'));
      }
    },

    methods: {

      async findUser() {
        // const id = "5e85b1787233d56448005adc"; // localhost
        const id = "5e81d73079c3be09f57dfc1a"; // atlas

        const query = `query FindUser($id: MongoID!){
  userById(_id: $id){
    email
        date
    validationDate
    _id
    pomodoroTime
    breakTime
    bigBreakTime
  }
}`;
        const result = await this.$axios.$post("/graphql", {
          query: query,
          variables: {
            id: id,
          }
        }).catch(reason => console.log(reason));

        return result.data.userById;
      },

      async validate(today) {
        const tasks = await taskService.loadTasks(this.user, taskManyByIdForTasks);
        const unassignedTask = tasks.filter(task => task.name === "unassigned")[0];

        // update unassigned task
        if (!unassignedTask) throw Error("Database data corruption! Unassigned task missing!");
        await this.selectUnassignedTaskAndUpdate(unassignedTask._id, today);

        // unselect task from previous day
        const selectedTaskFromPreviousDay = tasks
          .filter(task => task.selected === true && task.name !== "unassigned")[0];
        if (selectedTaskFromPreviousDay) await taskService.deselectTask(selectedTaskFromPreviousDay);

        // update user validation date
        await this.updateUserValidationDate(today);
      },

      async selectUnassignedTaskAndUpdate(_id, today) {
        const query = `mutation AssignUnassignedTaskToThisDay
($id: MongoID!,
 $dateAssigned: Date,
)
{
  taskUpdateById(record: {
  _id: $id,
   dateAssigned: $dateAssigned,
   selected: true
   }){
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
            id: _id,
            dateAssigned: today,
          },
        }).catch(reason => console.log(reason));
      },

      async updateUserValidationDate(today) {
        const _id = this.user._id;
        const validationDate = today;

        const query = `mutation UpdateUserValidationDate($_id: MongoID!, $validationDate: Date){
  userUpdateById(record: {
    _id: $_id,
    validationDate: $validationDate,
  }) {
    record {
      email
      pomodoroTime
      breakTime
      bigBreakTime
      validationDate
      _id
    }
  }
}`;

        const result = await this.$axios.$post("/graphql", {
          query: query,
          variables: {
            _id: _id,
            validationDate: validationDate,
          },
        }).catch(reason => console.log(reason));

        let newInfo = result.data.userUpdateById.record;

        let newUser = this.user;
        newUser.validationDate = newInfo.validationDate;

        localStorage.setItem('user', JSON.stringify(newUser));
        window.location = "/";
      },

      async redirectToAbout() {
        await this.$router.push("/about");
      },

      checkIfMobile(){
        return isMobile;
      },
    },
  }
</script>

<style>
</style>
