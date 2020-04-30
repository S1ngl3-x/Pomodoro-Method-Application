const { pubsub } = require("../resources/pubsub");

const fireTaskCreated = async (next, source, args, context, info) => {
  const result = await next(source, args, context, info).catch(reason =>
    console.log(reason)
  );
  await pubsub.publish("taskCreated", { taskCreated: result.record });
  return result;
};

const fireTaskUpdated = async (next, source, args, context, info) => {
  const result = await next(source, args, context, info).catch(reason =>
    console.log(reason)
  );
  await pubsub.publish("taskUpdated", { taskUpdated: result.record });
  return result;
};

const validation = async (next, source, args, context, info) => {
  const name = args.record.name.toLowerCase().trim();
  const forbiddenName = "unassigned";
  const invalid = name === forbiddenName;
  if (invalid) {
    const msg =
      "ERROR invalid name. Task name cannot be unassigned. " +
      "Every user already has an unassigned task. Please choose a different name";
    const error = new Error(msg);
    console.log(error);
    throw error;
  }
  return next(source, args, context, info);
};

exports.fireTaskCreated = fireTaskCreated;
exports.fireTaskUpdated = fireTaskUpdated;
exports.validation = validation;
