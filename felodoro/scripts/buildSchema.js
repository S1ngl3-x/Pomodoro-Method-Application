const fs = require("fs-extra");
const path = require("path");
const { graphql } = require("graphql");
const { introspectionQuery, printSchema } = require("graphql/utilities");
const Schema = require("../server/graphql/schema");

function buildSchema() {
  fs.ensureFile("../data/schema.graphql.json");
  fs.ensureFile("../data/schema.graphql");

  fs.writeFileSync(
    path.join(__dirname, "../data/schema.graphql.json"),
    JSON.stringify(graphql(Schema, introspectionQuery), null, 2)
  );

  fs.writeFileSync(
    path.join(__dirname, "../data/schema.graphql.txt"),
    printSchema(Schema)
  );
}

function run() {
  buildSchema();
  console.log("Schema build success!");
}

module.exports = run();
