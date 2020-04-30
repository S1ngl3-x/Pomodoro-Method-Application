const mongoose = require("mongoose");
const { composeWithMongoose } = require("graphql-compose-mongoose");
const Schema = mongoose.Schema;
mongoose.set("useCreateIndex", true);

const ReportSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  values: {
    type: [Number],
    required: true
  },
  data: {
    type: {},
    required: true
  },
  icon: {
    type: String,
    default: "mdi-file-chart"
  },
  date: {
    type: Date,
    default: new Date(),
    index: true
  },
  ownerId: {
    type: Schema.Types.ObjectID,
    ref: "User",
    required: true
  }
});

const Report = mongoose.model("Report", ReportSchema);
const ReportTC = composeWithMongoose(Report);

exports.Report = Report;
exports.ReportTC = ReportTC;
