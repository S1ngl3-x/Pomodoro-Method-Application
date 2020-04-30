const mongoose = require("mongoose");
const { composeWithMongoose } = require("graphql-compose-mongoose");
const Schema = mongoose.Schema;
const { CountdownTC } = require("./Countdown");
mongoose.set("useCreateIndex", true);

const TaskSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  pomodorosEstimated: {
    type: Number,
    default: 0
  },
  selected: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ["NEW", "COMPLETED", "CLOSED", "POSTPONED"],
    default: "NEW"
  },
  dateCreated: {
    type: Date,
    default: new Date()
  },
  dateAssigned: {
    type: Date,
    default: new Date(),
    index: true
  },
  dateFinished: {
    type: Date
  },
  ownerId: {
    type: Schema.Types.ObjectID,
    ref: "User",
    required: true
  }
});

const Task = mongoose.model("Task", TaskSchema);
const TaskTC = composeWithMongoose(Task);

exports.Task = Task;
exports.TaskTC = TaskTC;

TaskTC.addRelation("countdowns", {
  resolver: () => CountdownTC.getResolver("findMany"),
  prepareArgs: {
    filter: source => ({ ownerId: source._id })
  },
  projection: { _id: true }
});

// time spent is calculated from these pomodoros
TaskTC.addRelation("pomodorosSpent", {
  resolver: () => CountdownTC.getResolver("findMany"),
  prepareArgs: {
    filter: source => ({
      ownerId: source._id,
      type: "POMODORO",
      timeCurrent: {
        minutes: 0,
        seconds: 0
      }
    })
  },
  projection: { _id: true }
});

TaskTC.addRelation("pomodorosSpentCount", {
  resolver: () => CountdownTC.getResolver("count"),
  prepareArgs: {
    filter: source => ({
      ownerId: source._id,
      type: "POMODORO",
      timeCurrent: {
        minutes: 0,
        seconds: 0
      }
    })
  },
  projection: { _id: true }
});
