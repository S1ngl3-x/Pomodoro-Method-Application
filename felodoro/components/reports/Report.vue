<template>
  <v-container>
    <v-card
      class="mx-auto"
      color="grey lighten-4"
      max-width="1000"
    >
      <v-card-title>
        <v-row>
          <v-icon       @click="showDetails = !showDetails"
          >
            {{icon}}
          </v-icon>

          <div       @click="showDetails = !showDetails"
                     class="primary--text text-uppercase">
            {{name}} - {{dateDisplay}}
          </div>
        </v-row>
        <v-btn @click="dialog = true">graph</v-btn>
        <v-btn v-show="!showDetails" @click="showDetails = !showDetails">show details</v-btn>
        <v-btn v-show="showDetails" @click="showDetails = !showDetails">hide details</v-btn>
      </v-card-title>

      <v-card-text v-show="showDetails">
        <v-simple-table>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="test-left">{{name}}</th>
              <th class="test-left" v-if="data.dates">date</th>
              <th class="test-left" v-if="data.tasks">task</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="(val, index) in value">
              <td>{{val}}</td>
              <td v-if="data.dates">{{data.dates[index]}}</td>
              <td v-if="!Array.isArray(data.tasks[index])">{{data.tasks[index]}}</td>
              <td v-if="Array.isArray(data.tasks[index])">{{getItems(data.tasks[index])}}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>


        <v-dialog
          v-model="dialog"
          width="500"
        >
          <v-card>
            <v-container fluid>
                <v-icon @click="dialog = false">mdi-close</v-icon>
              <v-sparkline
                :gradient="gradient"
                :line-width="3"
                :padding="padding"
                :smooth="radius || false"
                :value="value"
                auto-draw
                max-width="600"
                show-labels
              ></v-sparkline>
            </v-container>
          </v-card>
        </v-dialog>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
  import moment from "moment";

  export default {
    name: "report",
    props: ["_id", "value", "date", "name", "importedData", "ownerId", "icon"],
    data() {
      return {
        dialog: false,
        data: JSON.parse(this.importedData),
        dateDisplay: moment(this.date).format("LL"),
        showDetails: false,
        gradient: ['#f72047', '#ffd200', '#1feaea'],
        padding: 8,
        radius: 10,
        width: 2,
      }
    },
    methods: {
      getItems(array) {
        let result = "";
        for (let val of array) {
          result = result.concat(val + ", ");
        }
        return result;
      }
    },
  }
</script>

<style scoped>
</style>
