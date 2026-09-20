const express= require("express");
const userRouter=express.Router();




// get all users
// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (er) {
//     res.send("Something went wrong", er);
//   }
// });


// get specific user

// app.get("/user", async (req, res) => {
//   try {
//     const user = await User.findOne({ firstName: req.body.firstName });
//     const cookie = req.cookies;
//     console.log(cookie);

//     res.send(user);
//   } catch (er) {
//     res.send("Something went wrong", er);
//   }
// });


//delete the user

// app.delete("/user", async (req, res) => {
//   try {
//     const user = await User.deleteOne({ firstName: req.body.firstName });
//     res.send("User deleted", user);
//   } catch (er) {
//     res.status(500).send("Something went wrong", er);
//   }
// });

module.exports=userRouter;