const mongoose = require("mongoose");

const connectToMongoDB = (url) => {
  mongoose
    .connect(url)
    .then(() => console.log(`Connected to MongoDB`))
};

module.exports = connectToMongoDB;
