const { pubsub } = require("../resources/pubsub");

const fireCountdownCreated = async (next, source, args, context, info) => {
  const result = await next(source, args, context, info).catch(reason =>
    console.log(reason)
  );
  await pubsub.publish("countdownCreated", { countdownCreated: result.record });
  return result;
};

const fireCountdownUpdated = async (next, source, args, context, info) => {
  const result = await next(source, args, context, info).catch(reason =>
    console.log(reason)
  );
  await pubsub.publish("countdownUpdated", { countdownUpdated: result.record });
  return result;
};

const fireCountdownGetUpdate = async (next, source, args, context, info) => {
  const result = await next(source, args, context, info).catch(reason =>
    console.log(reason)
  );
  await pubsub.publish("countdownGetUpdate", { countdownGetUpdate: result });
  return result;
};

exports.fireCountdownCreated = fireCountdownCreated;
exports.fireCountdownUpdated = fireCountdownUpdated;
exports.fireCountdownGetUpdate = fireCountdownGetUpdate;
