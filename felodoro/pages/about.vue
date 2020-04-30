<template>
  <div>
    <div class="display-4" style="color: indigo">Felodoro</div>
    <div class="title font-weight-light">Application based on Pomodoro - the time management technique</div>
    <!--    <div class="headline">Time management technique</div>-->

    <v-row v-if="!userInLocalStorage" justify="begin">
      <v-btn to="/login" color="primary" class="ma-4 pa-auto">login</v-btn>
      <v-btn to="/registration" dark color="purple lighten-2" class="ma-4 pa-auto">registration</v-btn>
    </v-row>


    <div class="display-1 mt-2 mb-1">Essential</div>

    <v-expansion-panels popout focusable hover>

      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>How to get the mobile app
          <template v-slot:actions>
            <v-icon color="primary">mdi-alert-decagram</v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          This mobile "app" will enhance your Felodoro experience and takes no space in your memory, so it is highly
          recommended to get it.
          All it takes is 3 clicks - about 5 seconds.
          <v-select
            :items="operatingSystems"
            label="Select your operating system"
            solo
            v-model="selectedOperatingSystem"
          ></v-select>

          <!--          android-->
          <div v-if="selectedOperatingSystem === operatingSystems[0]">


            <v-row justify="space-around">
              <v-img src="/images/android_alternative/android_alternative_manual_1.JPG" contain max-width="300" max-height="800"></v-img>
              <v-img src="/images/android_alternative/android_alternative_manual_2.JPG" contain max-width="300" max-height="800"></v-img>
              <v-img src="/images/android_alternative/android_alternative_manual_3.JPG" contain max-width="300" max-height="800"></v-img>
              <v-img src="/images/android_alternative/android_alternative_manual_4.JPG" contain max-width="300" max-height="800"></v-img>
            </v-row>

            <v-chip @click="showAndroidAlternative = !showAndroidAlternative">Prompt to add application showed up? Try it this way!</v-chip>

            <v-row justify="space-around" v-if="showAndroidAlternative">
              <v-img src="/images/android/android_manual_1.JPG" contain max-width="300" max-height="800"></v-img>
              <v-img src="/images/android/android_manual_2.JPG" contain max-width="300" max-height="800"></v-img>
              <v-img src="/images/android/android_manual_3.JPG" contain max-width="300" max-height="800"></v-img>
            </v-row>


          </div>


          <!--          ios-->
          <div v-if="selectedOperatingSystem === operatingSystems[1]">
            <v-row justify="space-around">
              <v-img src="/images/ios/ios_manual_1.PNG" contain max-width="300" max-height="800"></v-img>
              <v-img src="/images/ios/ios_manual_2.PNG" contain max-width="300" max-height="800"></v-img>
              <v-img src="/images/ios/ios_manual_2_1.PNG" contain max-width="300" max-height="800"></v-img>
              <v-img src="/images/ios/ios_manual_3.PNG" contain max-width="300" max-height="800"></v-img>
            </v-row>
          </div>


        </v-expansion-panel-content>
      </v-expansion-panel>


      <v-expansion-panel>
        <v-expansion-panel-header>Disclaimer</v-expansion-panel-header>
        <v-expansion-panel-content>
          This application is not a professional production software. It is merely a unique take on the Pomodoro
          technique.
          Felodoro is an open source, anyone can build upon it. Do not store any sensitive information here!
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>Why Felodoro</v-expansion-panel-header>
        <v-expansion-panel-content>
          TRULY cross-platform. Integrated tasks and reports. Mobile app.
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>How Pomodoro works</v-expansion-panel-header>
        <v-expansion-panel-content>
          Pomodoro helps you concentrate on your work. It does so by separating your working and relaxing time.
          You should feel comfortable working and have a satisfied feeling you did wel.
          It also helps with defeating procrastination.
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>How to use Felodoro</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-select
            :items="experienceLevels"
            label="How familiar are you with Pomodoro?"
            solo
            v-model="experience"
          ></v-select>

          {{manual}}
        </v-expansion-panel-content>
      </v-expansion-panel>

    </v-expansion-panels>


    <div class="display-1 mt-2 mb-1">Recommended</div>

    <v-expansion-panels popout focusable hover>

      <v-expansion-panel>
        <v-expansion-panel-header>How to stop the phone from auto-locking</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-select
            :items="operatingSystems"
            label="Select your operating system"
            solo
            v-model="selectedOperatingSystem"
          ></v-select>

          <!-- android -->
          <div v-if="selectedOperatingSystem === operatingSystems[0]">
            Settings -> Display & Brightness -> Auto Lock -> Never option
          </div>

          <!-- ios -->
          <div v-if="selectedOperatingSystem === operatingSystems[1]">
            Settings -> Sound & display -> Screen Timeout -> Never
          </div>

        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>Unique features of Felodoro</v-expansion-panel-header>
        <v-expansion-panel-content>
          There are so many apps and webs that are based on Pomodoro. Why should you use this one?
          Because this is the only one that supports using multiple devices at the same time!
          It also has a reasonable complexity so you can get better at utilizing the whole Pomodoro technique potential.
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>Felodoro's limitations</v-expansion-panel-header>
        <v-expansion-panel-content>
          Bear in mind this is not a production software.
          No password recovery system!!!
          Lack of any integration with task management systems like Trello.
          The countdown is not running on a server!
          It is running on your client. So closing the tab while countdown is running will not work. Same for the mobile
          app.
          For the countdown to work, you always need to have at least one device with running countdown in Home section.
          You cannot adjust tasks while countdown is running.
          Your breaks unfortunately do not transfer from one task to another (my bad).

          Notifications work very unreliably. Closing the tab/app and reopening usually solves the issue.
          This feature was not meant to be in the app in the first place. I added it as a small bonus.

          Safari on macOS is not supported at all! Use Chrome instead.
          Safari on iOS has limited functionality. Sounds and notification do not work.
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!--      todo finish this later-->
      <!--      <v-expansion-panel>-->
      <!--        <v-expansion-panel-header>How to run the code yourself</v-expansion-panel-header>-->
      <!--        <v-expansion-panel-content>-->
      <!--          Just clone the git repository from HERE (SAFE REPO).-->
      <!--          Adjust the connection file for your own mongo database (can be localhost). Manual how to do so HERE.-->
      <!--          Make sure you have Vue.js and Node.js.-->
      <!--          Run commands: "npm i", "npm run dev".-->
      <!--          Congratulations. Felodoro is now running on http://localhost:3000.-->
      <!--          You can test the GraphQL API at http://localhost:3000/graphql. Use Altair or GraphQL Playground.-->
      <!--        </v-expansion-panel-content>-->
      <!--      </v-expansion-panel>-->

      <v-expansion-panel>
        <v-expansion-panel-header>Part of bachelor's thesis</v-expansion-panel-header>
        <v-expansion-panel-content>
          You can check out the full bachelor thesis here. It belongs to Czech technical university in Prague.
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>About the author</v-expansion-panel-header>
        <v-expansion-panel-content>
          My name is Adam Lipowski. I am a student at Czech technical university in Prague.
          If you have any questions or ideas concerning Felodoro do not hesitate to email me at adam.lipowski@email.cz .
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>About the app</v-expansion-panel-header>
        <v-expansion-panel-content>
          Felodoro is the first truly cross-platform implementation of the Pomodoro technique.
          This empowers it's users to harvest all the benefits their devices provide them with.
          Want a big screen and fast typing while preparing your daily plan? Use the computer.
          Want to know that your break has ended while enjoying fresh air outside your office? Use the mobile app.
          Want to set up everything on computer and just use the phone as a watch to check on the time? Use them both.
          Everything is synchronized!
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>Technical description</v-expansion-panel-header>
        <v-expansion-panel-content>
          Felodoro is a Single Page Application written completely in Javascript.
          The frontend is written in Nuxt.js, a Vue.js framework.
          Nuxt.js also handles the mobile app, that is Progressive Web Application (PWA).
          UI is handled by Vuetify, bootstrap-like material design library for Vue.js.
          The backend runs in Node.js using Express and exposes GraphQL API that supports subscriptions (thus web
          sockets are used).
          Chosen database is MongoDB.
          Database driver is Mongoose - ensures some database validity, handles password hashing and is used as model
          for generating GraphQL schema.
        </v-expansion-panel-content>
      </v-expansion-panel>

    </v-expansion-panels>
  </div>
</template>

<script>
  export default {
    middleware: ["first_visit"],
    data() {
      return {
        languages: ["English", "Česky"],
        selectedLanguage: null,
        operatingSystems: ["Android", "iOS"],
        selectedOperatingSystem: null,
        experienceLevels: ["New", "Some experience", "Advanced"],
        experience: null,
        showAndroidAlternative: false,


        manualEnglish: [
          "IT'S EASY.\n" +
          "    Just get rid of all your distractions (probably your phone notifications), hit the Start button and get some real work done.\n" +
          "    Once the timer ends, forget about your work, do what you want. Stand up, chat with a friend, do the dishes, have some juice.\n" +
          "    When the timer for break ends, go back to your focused work. Rinse and repeat!\n" +
          "\n" +
          "    NO CHEATING!\n" +
          "    In case your focus is disrupted, hit Pause and Reset Pomodoro.\n" +
          "    You will start over.\n" +
          "    Distracted Pomodoro is not a Pomodoro.\n" +
          "    Ideally, you should never Pause and Resume Pomodoro, it is against the Pomodoro technique principle.\n" +
          "\n" +
          "    Once you are done working, check out section Tasks to see how much concentrated working time you put up today.",

          "1) Plan your tasks.\n" +
          "    Go to section Tasks. Determine what your goal is for today and what tasks need to be handled to achieve it.\n" +
          "    A task should not take more than 7 Pomodoros (25 minutes x 7). 3-5 Pomodoros is optimal.\n" +
          "\n" +
          "    2) Do the work.\n" +
          "    Go to section Home. Select a task if you have not already and start the first pomodoro.\n" +
          "    When your task is finished, wait for it's break to end and select a new task.\n" +
          "\n" +
          "    3) Enjoy the fruits of your work.\n" +
          "    Once all your tasks are completed or your working time is over, head to section Tasks to check how you did today.\n" +
          "    There will be an information displayed about how much time you spent working and how many tasks you tackled.\n" +
          "    You can even go further and head to sections Reports for detailed data and save the report if you so desire.\n" +
          "\n" +
          "    In case you have some unfinished tasks left, you can either postpone them or leave them there.\n" +
          "    The next day, you will see that you have unfinished old tasks left and be able to renew them and get back to working.",

          "1) Plan the tasks and their difficulty.\n" +
          "    When adding a task, do try to estimate how many Pomodoros will it take to complete it.\n" +
          "    This is done by clicking on the grey apple icon. If it is more than 7, split it to sub tasks.\n" +
          "    Your daily tasks should require about 10 - 12 Pomodoros.\n" +
          "\n" +
          "    2) Do the work.\n" +
          "    Same as in the \"SOME EXPERIENCE\" manual. If you feel brave, skip a break to get more work done.\n" +
          "\n" +
          "    3) Evaluate.\n" +
          "    Section Reports is your best friend here. Check how much time each completed task took.\n" +
          "    How accurate are your Pomodoro estimations.\n" +
          "    How much time you spent working each day.\n" +
          "    Use those statistics to ensure the following days will be even more productive.\n" +
          "\n" +
          "    You can save the reports. Have a look at them at the bottom of the page, click Load saved reports to see how are you doing compared to your old self."
        ],
      }
    },

    async created() {
      this.selectedLanguage = this.detectLanguage();
      this.selectedOperatingSystem = this.detectOperatingSystem();
      // this.experience = this.experienceLevels[0];
    },

    computed: {
      manual() {
        if (this.experience === null) return "";
        const index = this.experienceLevels.indexOf(this.experience);
        return this.manualEnglish[index];
      },

      userInLocalStorage() {
        return JSON.parse(localStorage.getItem('user'));
      }

    },


    methods: {
      detectLanguage() {
        const browserLanguage = navigator.language;
        return (browserLanguage === "en-US") ? this.languages[0] : this.languages[1];
      },

      detectOperatingSystem() {
        const userAgent = navigator.userAgent;
        if (/iPad|iPhone|iPod/i.test(userAgent)) {
          return this.operatingSystems[1];
        }
        if (/android/i.test(userAgent)) {
          return this.operatingSystems[0];
        }
        return null
      },
    }
  }
</script>

<style scoped>

</style>


<!--    <br>-->
<!--    <h3>Language</h3>-->
<!--    <v-select-->
<!--      :items="languages"-->
<!--      label="Select your language"-->
<!--      solo-->
<!--      v-model="selectedLanguage"-->
<!--    ></v-select>-->
