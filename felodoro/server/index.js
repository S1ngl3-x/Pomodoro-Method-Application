const express = require("express");
const consola = require("consola");
const { Nuxt, Builder } = require("nuxt");
const cors = require("cors");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { execute, subscribe } = require("graphql");
const { createServer } = require("http");
const { graphiqlExpress, graphqlExpress } = require("graphql-server-express");
const bodyParser = require("body-parser");

const server = express();

// Import and Set Nuxt.js options
const config = require("../nuxt.config.js");
config.dev = process.env.NODE_ENV !== "production";

// GraphQL schema
const schema = require("./graphql/schema");

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  const { host, port } = nuxt.options.server;

  // accept clients
  server.use("*", cors({ origin: `http://${host}:${port}` })); // http for localhost
  // server.use("*", cors({ origin: `https://${host}:${port}` })); // https

  // setup graphql server
  server.use("/graphql", bodyParser.json(), graphqlExpress({ schema }));
  server.use(
    "/graphiql",
    graphiqlExpress({
      endpointURL: "/graphql",
      subscriptionsEndpoint: `ws://${host}:${port}/subscriptions` // http for localhost
      // subscriptionsEndpoint: `wss://${host}:${port}/subscriptions` // https
    })
  );

  // database connection
  await require("./database/connection");

  // generate GraphQL schema
  await require("../scripts/buildSchema");

  await nuxt.ready();
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  // Give nuxt middleware to express
  server.use(nuxt.render);

  // wrap express server in web socket
  const webSocket = createServer(server);

  // config web socket
  webSocket.on("timeout", function(timedOutSocket) {
    timedOutSocket.end();
  });
  webSocket.setTimeout(1000 * 60 * 300);

  // start server
  webSocket.listen(port, () => {
    consola.ready({
      message: `Server listening on http://${host}:${port}`,
      badge: true
    });

    // Set up the WebSocket for handling GraphQL subscriptions
    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
        keepAlive: 10000
      },
      {
        server: webSocket,
        path: "/subscriptions"
      }
    );
  });
}

start();
