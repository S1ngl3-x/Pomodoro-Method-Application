const mongoose = require("mongoose");
const { composeWithMongoose } = require("graphql-compose-mongoose");
const Schema = mongoose.Schema;

const TimeSchema = mongoose.Schema({
  minutes: {
    type: Number,
    required: true
  },
  seconds: {
    type: Number,
    default: 0
  }
});

const CountdownSchema = mongoose.Schema({
  timeTotal: {
    type: TimeSchema,
    required: true
  },
  timeCurrent: {
    type: TimeSchema,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  },
  running: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ["POMODORO", "BREAK"],
    required: true
  },
  date: {
    type: Date,
    default: new Date(),
    index: true
  },
  ownerId: {
    type: Schema.Types.ObjectID,
    ref: "Task",
    required: true
  }
});

const Countdown = mongoose.model("Countdown", CountdownSchema);
const CountdownTC = composeWithMongoose(Countdown);

exports.Countdown = Countdown;
exports.CountdownTC = CountdownTC;
