const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

// connection Api

userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const connections = await ConnectionRequest.find({
      $or: [
        {
          toUserId: req.user._id,
          status: "accepted",
        },
        {
          fromUserId: req.user._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", ["firstName", "lastname"])
      .populate("toUserId", ["firstName", "lastName"]);

    const data = connections.map((row) => {
      if (row.fromUserId._id.equals(req.user._id)) {
        return row.toUserId;
      }

      return row.fromUserId;
    });
    res.status(200).json({
      data: data,
      message: "Connections fetched successfully",
    });
  } catch (er) {
    res.status(500).json({
      message: er.message,
    });
  }
});

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

module.exports = userRouter;
