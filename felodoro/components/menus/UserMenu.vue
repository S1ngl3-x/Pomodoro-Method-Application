<template>
    <v-menu
      v-model="menu"
      v-show="display"
      v-if="display"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-y
      transition="slide-y-transition"
      bottom
      class="text-center disable-dbl-tap-zoom"
    >
      <template v-slot:activator="{ on }">
          <v-list-item-avatar color="primary" v-on="on">
            <span class="white--text headline">{{user.email.charAt(0).toUpperCase()}}</span>
          </v-list-item-avatar>
      </template>

      <v-card class="pr-4">
        <v-list>
          <v-list-item>
            <v-list-item-avatar color="primary">
              <span class="white--text headline">{{user.email.charAt(0).toUpperCase()}}</span>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{user.email}}</v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon @click="logout">
                <v-tooltip bottom :disabled="checkIfMobile()">
                  <template v-slot:activator="{ on }">
                    <v-icon color="primary" dark v-on="on">mdi-logout-variant</v-icon>
                  </template>
                  <span>Logout</span>
                </v-tooltip>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
<!--          <v-list-item>-->
<!--            <v-list-item-action>-->
<!--              <v-switch v-model="notifications" color="purple"></v-switch>-->
<!--            </v-list-item-action>-->
<!--            <v-list-item-title>Enable notifications</v-list-item-title>-->
<!--          </v-list-item>-->

          <v-list-item>
            <v-list-item-action>
              <v-switch v-model="sounds" @change="saveChange" color="purple"></v-switch>
            </v-list-item-action>
            <v-list-item-title>Sounds on this device</v-list-item-title>
          </v-list-item>

          <v-list-item >
            <v-list-item-action class="mx-auto">
              <v-btn small v-show="!adjust" @click="adjust = !adjust">Adjust countdowns</v-btn>

              <v-row>
                <v-btn small v-show="adjust && timersChanged" color="primary" @click="updateTimers">Confirm</v-btn>
                <v-btn small v-show="adjust && !timersChanged" disabled>Confirm</v-btn>
                <v-btn small v-show="adjust" @click="cancel">Cancel</v-btn>
                <v-btn small v-show="adjust" @click="setDefaultValues">Default</v-btn>
              </v-row>
              </v-list-item-action>
          </v-list-item>
        </v-list>

<!--        TIMER CHANGING-->

        <v-divider></v-divider>

        <v-card
                  max-width="600" min-width="300"
                  v-show="adjust" class="disable-dbl-tap-zoom pr-4" elevation="0"
          >
            <v-card-text>

              <div>

              <v-row
                      class="mb-4"
                      justify="space-between"
              >
                <v-col class="text-left">
          <span class="display-1 font-weight-light">Pomodoro:</span>
                </v-col>
                <v-col class="text-right">
                  <span class="display-1 font-weight-light">{{newPomodoroTime}}</span>
                </v-col>
              </v-row>

              <v-slider
                      v-model="newPomodoroTime"
                      :color="color"
                      track-color="grey"
                      always-dirty
                      min="1"
                      max="120"
              >
                <template v-slot:prepend>
                  <v-icon
                          :color="color"
                          @click="newPomodoroTime--"
                  >
                    mdi-minus
                  </v-icon>
                </template>

                <template v-slot:append>
                  <v-icon
                          :color="color"
                          @click="newPomodoroTime++"
                  >
                    mdi-plus
                  </v-icon>
                </template>
              </v-slider>
              </div>

              <div>

                <v-row
                        class="mb-4"
                        justify="space-between"
                >
                  <v-col class="text-left">
                    <span class="display-1 font-weight-light">Break:</span>
                  </v-col>
                  <v-col class="text-right">
                    <span class="display-1 font-weight-light">{{newBreakTime}}</span>
                  </v-col>
                </v-row>

                <v-slider
                        v-model="newBreakTime"
                        :color="color"
                        track-color="grey"
                        always-dirty
                        min="1"
                        max="60"
                >
                  <template v-slot:prepend>
                    <v-icon
                            :color="color"
                            @click="newBreakTime--"
                    >
                      mdi-minus
                    </v-icon>
                  </template>

                  <template v-slot:append>
                    <v-icon
                            :color="color"
                            @click="newBreakTime++"
                    >
                      mdi-plus
                    </v-icon>
                  </template>
                </v-slider>
              </div>



              <div>

                <v-row
                        class="mb-4"
                        justify="space-between"
                >
                  <v-col class="text-left">
                    <span class="display-1 font-weight-light">Big break:</span>
                  </v-col>
                  <v-col class="text-right">
                    <span class="display-1 font-weight-light">{{newBigBreakTime}}</span>
                  </v-col>
                </v-row>

                <v-slider
                        v-model="newBigBreakTime"
                        :color="color"
                        track-color="grey"
                        always-dirty
                        min="1"
                        max="60"
                >
                  <template v-slot:prepend>
                    <v-icon
                            :color="color"
                            @click="newBigBreakTime--"
                    >
                      mdi-minus
                    </v-icon>
                  </template>

                  <template v-slot:append>
                    <v-icon
                            :color="color"
                            @click="newBigBreakTime++"
                    >
                      mdi-plus
                    </v-icon>
                  </template>
                </v-slider>
              </div>
            </v-card-text>
          </v-card>
      </v-card>
    </v-menu>
</template>

<script>
  import {isMobile} from "mobile-device-detect";

  export default {
    name: "user-menu",
    props: ["user", "logged"],
    data() {
      return {
        fav: true,
        menu: false,
        notifications: false,
        sounds: true,
        display: true,
        newPomodoroTime : this.user.pomodoroTime,
        newBreakTime : this.user.breakTime,
        newBigBreakTime : this.user.bigBreakTime,
        adjust: false,
        interval: null,
        active: false,
        color: "indigo"
      }
    },

    created() {
      this.sounds = this.getSoundPermissionStatus();
    },

    computed: {
      timersChanged(){
        return (this.user.pomodoroTime !== this.newPomodoroTime)
                || (this.user.breakTime !== this.newBreakTime)
                || (this.user.bigBreakTime !== this.newBigBreakTime);
      },
    },

    methods: {
      cancel(){
        this.adjust = false;
        this.newPomodoroTime = this.user.pomodoroTime;
        this.newBreakTime = this.user.breakTime;
        this.newBigBreakTime = this.user.bigBreakTime;
      },

      setDefaultValues() {
        this.newPomodoroTime = 25;
        this.newBreakTime = 5;
        this.newBigBreakTime = 25;
      },

      async updateTimers() {
        const _id = this.user._id;
        const pomodoroTime = this.newPomodoroTime;
        const breakTime = this.newBreakTime;
        const bigBreakTime = this.newBigBreakTime;


        const query = `mutation UpdateCountdownPreferences(
  $_id: MongoID!,
  $pomodoroTime: Float,
  $breakTime: Float,
  $bigBreakTime: Float,
){
  userUpdateById(record: {
    _id: $_id,
    pomodoroTime: $pomodoroTime,
    breakTime: $breakTime,
    bigBreakTime: $bigBreakTime,
  }
  ){
    recordId
    record{
          email
    date
    pomodoroTime
    breakTime
    bigBreakTime
    validationDate
    _id
    }
  }
}`;
        const result = await this.$axios.$post("graphql", {
          query: query,
          variables: {
            _id: _id,
            pomodoroTime: pomodoroTime,
            breakTime: breakTime,
            bigBreakTime: bigBreakTime,
          },
        }).catch(reason => console.log(reason));
      },

      logout() {
        localStorage.removeItem('user');

        this.display = false;
        this.menu = false;
        this.$router.push("/login");
      },

      checkIfMobile(){
        return isMobile;
      },

      getSoundPermissionStatus() {
        let sounds = JSON.parse(localStorage.getItem("sounds"));
        if (sounds === null) sounds = true;
        return sounds;
      },

      saveChange() {
        localStorage.setItem("sounds", JSON.stringify(this.sounds));
      },

    },
  }
</script>

<style scoped>
  .disable-dbl-tap-zoom {
    touch-action: manipulation;
  }

  @keyframes metronome-example {
    from {
      transform: scale(.5);
    }

    to {
      transform: scale(1);
    }
  }
</style>
