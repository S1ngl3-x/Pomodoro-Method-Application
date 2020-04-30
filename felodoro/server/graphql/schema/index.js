const { SchemaComposer } = require("graphql-compose");

const schemaComposer = new SchemaComposer();

const { ReportQuery, ReportMutation } = require("./report");
const { TaskQuery, TaskMutation, TaskSubscription } = require("./task");
const { UserQuery, UserMutation, UserSubscription } = require("./user");
const {
  CountdownQuery,
  CountdownMutation,
  CountdownSubscription
} = require("./countdown");

schemaComposer.Query.addFields({
  ...ReportQuery,
  ...TaskQuery,
  ...UserQuery,
  ...CountdownQuery
});

schemaComposer.Mutation.addFields({
  ...ReportMutation,
  ...TaskMutation,
  ...UserMutation,
  ...CountdownMutation
});

schemaComposer.Subscription.addFields({
  ...CountdownSubscription,
  ...TaskSubscription,
  ...UserSubscription
});

module.exports = schemaComposer.buildSchema();
