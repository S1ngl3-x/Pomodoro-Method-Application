// this file provides unified instance of Pub/Sub (asynchronous messaging service) to all other services
const { PubSub, withFilter } = require("graphql-subscriptions");
const pubsub = new PubSub();

exports.pubsub = pubsub;
exports.withFilter = withFilter;
