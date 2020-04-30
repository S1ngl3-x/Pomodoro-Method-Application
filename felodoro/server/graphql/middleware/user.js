const { Task } = require("../../database/models/Task");
const { pubsub } = require("../resources/pubsub");

const createUnassignedTask = async (next, s, a, c, i) => {
  const result = await next(s, a, c, i).catch(reason => console.log(reason));
  const newTask = new Task({ name: "unassigned", ownerId: result.recordId });
  await newTask.save().catch(reason => console.log(reason));
  return result;
};

const disablePasswordQuery = async (next, source, args, context, info) => {
  const result = await next(source, args, context, info).catch(reason =>
    console.log(reason)
  );
  if (result.password) {
    throw Error("You are not allowed to ask for a user's password!");
  }
  return result;
};

const disablePasswordInfoInMutation = async (
  next,
  source,
  args,
  context,
  info
) => {
  const result = await next(source, args, context, info).catch(reason =>
    console.log(reason)
  );

  let safeResult = JSON.parse(JSON.stringify(result));
  safeResult.record.password =
    "You are not allowed to ask for a user's password!";
  safeResult.record._id = "You are not allowed to ask for a user's id!";

  return safeResult;
};

const fireUserUpdated = async (next, source, args, context, info) => {
  const result = await next(source, args, context, info).catch(reason =>
    console.log(reason)
  );

  let safeResult = JSON.parse(JSON.stringify(result));
  safeResult.record.password =
    "You are not allowed to ask for a user's password!";
  safeResult.record._id = "You are not allowed to ask for a user's id!";

  await pubsub.publish("userUpdated", { userUpdated: safeResult.record });
  return result;
};

exports.createUnassignedTask = createUnassignedTask;
exports.disablePasswordQuery = disablePasswordQuery;
exports.disablePasswordInfoInMutation = disablePasswordInfoInMutation;
exports.fireUserUpdated = fireUserUpdated;
