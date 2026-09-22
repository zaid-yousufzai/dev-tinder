const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/userAuth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { status, toUserId } = req.params;

      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Status type is not allowed",
        });
      }

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        return res.status(400).json({
          message: "Request is already present",
        });
      }

      const request = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await request.save();

      return res.status(201).json({
        data,
        message: "Request sent successfully",
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  },
);

module.exports = requestRouter;
