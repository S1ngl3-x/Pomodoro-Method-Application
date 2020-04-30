const mongoose = require("mongoose");

// TODO - add your own localhost database connection if you can
// const url = "mongodb://127.0.0.1:27017/felodoro";
const url =
  "mongodb+srv://felodoro:felodoro@cluster0-wgkph.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("error", () =>
  console.log(
    "An ERROR occurred while connecting to the database: " + url + " !!!"
  )
);
// mongoose.connection.once("open", () => console.log("Success connecting to the database: " + url));

module.exports = mongoose;
