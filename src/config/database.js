const mongoose = require("mongoose");

async function dbConnect() {
  await mongoose.connect(
    "mongodb+srv://zaidreact18_db_user:Pi44dSapsew5UgnB@mern.tcrj9wr.mongodb.net/devTinder",
  );
}

module.exports = { dbConnect };
