const mongoose = require("mongoose");
const User = require("../models/user");

async function dbConnect() {
  await mongoose.connect(
    "mongodb+srv://zaidreact18_db_user:Pi44dSapsew5UgnB@mern.tcrj9wr.mongodb.net/devTinder",
  //  {autoIndex: true, }
  );
}




// Add an event listener to catch index creation failures
// User.on("index", (err) => {
//   if (err) {
//     console.error("Index creation failed:", err.message);
//   } else {
//     console.log("Indexes built successfully!");
//   }
// });

module.exports = { dbConnect };
