const { SubscriptionClient } = require("graphql-subscriptions-client");

const GRAPHQL_ENDPOINT = "ws://" + location.host + "/subscriptions"; //http for localhost
// const GRAPHQL_ENDPOINT = "wss://" + location.host + "/subscriptions"; // https

const socket = new SubscriptionClient(GRAPHQL_ENDPOINT, {
  reconnect: true,
  reconnectionAttempts: 50,
  lazy: true,
  timeout: 20000
});

module.exports = socket;
