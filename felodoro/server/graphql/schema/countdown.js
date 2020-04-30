const { CountdownTC } = require("../../database/models/Countdown");
const { pubsub, withFilter } = require("../resources/pubsub");
const {
  fireCountdownCreated,
  fireCountdownUpdated,
  fireCountdownGetUpdate
} = require("../middleware/countdown");

const CountdownQuery = {
  countdownById: CountdownTC.getResolver("findById"),
  countdownByIds: CountdownTC.getResolver("findByIds"),
  countdownCount: CountdownTC.getResolver("count"),
  countdownGetUpdate: CountdownTC.getResolver("findOne", [
    fireCountdownGetUpdate
  ])

  // countdownOne: CountdownTC.getResolver('findOne'),
  // countdownMany: CountdownTC.getResolver('findMany'),
  // countdownConnection: CountdownTC.getResolver('connection'),
  // countdownPagination: CountdownTC.getResolver('pagination'),
};

const CountdownMutation = {
  countdownCreateOne: CountdownTC.getResolver("createOne", [
    fireCountdownCreated
  ]),
  countdownUpdateById: CountdownTC.getResolver("updateById", [
    fireCountdownUpdated
  ]),
  countdownUpdateOne: CountdownTC.getResolver("updateOne", [
    fireCountdownUpdated
  ])

  // countdownUpdateMany: CountdownTC.getResolver('updateMany'),
  // countdownRemoveById: CountdownTC.getResolver('removeById'),
  // countdownRemoveOne: CountdownTC.getResolver('removeOne'),
  // countdownRemoveMany: CountdownTC.getResolver('removeMany'),
};

const CountdownSubscription = {
  countdownCreated: {
    type: CountdownTC,
    description: "Subscribe to Create Countdown",
    args: { ownerId: CountdownTC.getFieldType("ownerId") },
    resolve: (payload, args, context, info) => payload.countdownCreated,
    subscribe: withFilter(
      () => pubsub.asyncIterator("countdownCreated"),
      (payload, args) => {
        return payload.countdownCreated.ownerId.equals(args.ownerId);
      }
    )
  },
  countdownUpdated: {
    type: CountdownTC,
    description: "Subscribe to Update Countdown",
    args: { ownerId: CountdownTC.getFieldType("ownerId") },
    resolve: (payload, args, context, info) => payload.countdownUpdated,
    subscribe: withFilter(
      () => pubsub.asyncIterator("countdownUpdated"),
      (payload, args) => {
        return payload.countdownUpdated.ownerId.equals(args.ownerId);
      }
    )
  },
  countdownGetUpdate: {
    type: CountdownTC,
    description: "Subscribe to Countdown Get Update",
    args: { ownerId: CountdownTC.getFieldType("ownerId") },
    resolve: (payload, args, context, info) => payload.countdownGetUpdate,
    subscribe: withFilter(
      () => pubsub.asyncIterator("countdownGetUpdate"),
      (payload, args) => {
        return payload.countdownGetUpdate.ownerId.equals(args.ownerId);
      }
    )
  }
};

exports.CountdownQuery = CountdownQuery;
exports.CountdownMutation = CountdownMutation;
exports.CountdownSubscription = CountdownSubscription;
