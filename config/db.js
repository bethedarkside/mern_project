const config = require("config");
const mongoose = require("mongoose");

const db = config.get("mongoURI");

const connect = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("mongodb is connected...");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connect;
