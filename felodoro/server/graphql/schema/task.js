const { TaskTC, Task } = require("../../database/models/Task");
const { pubsub, withFilter } = require("../resources/pubsub");
const {
  validation,
  fireTaskCreated,
  fireTaskUpdated
} = require("../middleware/task");

TaskTC.addResolver({
  kind: "query",
  name: "findManyRestricted",
  args: {
    filter: `input  FilterFindManyTaskInput {
      ownerId: MongoID!,
      status: String,
    }`
  },
  type: [TaskTC],
  resolve: async ({ args, context }) => {
    return Task.find({
      ownerId: args.filter.ownerId,
      ...(args.filter.status ? { status: args.filter.status } : {})
    }).sort({ dateAssigned: "desc" }); // TODO - PRIDAT LIMIT(100) A NAPSAT RESOLVER BEZ LIMITU
  }
});

const TaskQuery = {
  taskMany: TaskTC.getResolver("findManyRestricted"),
  taskCount: TaskTC.getResolver("count")

  // taskById: TaskTC.getResolver('findById'),
  // taskByIds: TaskTC.getResolver('findByIds'),
  // taskOne: TaskTC.getResolver('findOne'),
  // taskMany: TaskTC.getResolver('findMany'),
  // taskConnection: TaskTC.getResolver('connection'),
  // taskPagination: TaskTC.getResolver('pagination'),
};

const TaskMutation = {
  taskCreateOne: TaskTC.getResolver("createOne", [validation, fireTaskCreated]),
  taskUpdateById: TaskTC.getResolver("updateById", [fireTaskUpdated]),
  taskUpdateByIdNoSub: TaskTC.getResolver("updateById")

  // taskUpdateOne: TaskTC.getResolver('updateOne', [fireTaskUpdated]),
  // taskUpdateMany: TaskTC.getResolver('updateMany'),
  // taskRemoveById: TaskTC.getResolver('removeById'),
  // taskRemoveOne: TaskTC.getResolver('removeOne'),
  // taskRemoveMany: TaskTC.getResolver('removeMany'),
};

const TaskSubscription = {
  taskCreated: {
    type: TaskTC,
    description: "Subscribe to Create Task",
    args: { ownerId: TaskTC.getFieldType("ownerId") },
    resolve: (payload, args, context, info) => payload.taskCreated,
    subscribe: withFilter(
      () => pubsub.asyncIterator("taskCreated"),
      (payload, args) => {
        return payload.taskCreated.ownerId.equals(args.ownerId);
      }
    )
  },
  taskUpdated: {
    type: TaskTC,
    description: "Subscribe to Update Task",
    args: { ownerId: TaskTC.getFieldType("ownerId") },
    resolve: (payload, args, context, info) => payload.taskUpdated,
    subscribe: withFilter(
      () => pubsub.asyncIterator("taskUpdated"),
      (payload, args) => {
        return payload.taskUpdated.ownerId.equals(args.ownerId);
      }
    )
  }
};

exports.TaskQuery = TaskQuery;
exports.TaskMutation = TaskMutation;
exports.TaskSubscription = TaskSubscription;
