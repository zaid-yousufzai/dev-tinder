const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/userAuth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
// to send the connection request
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

// to review the connection request
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "reqjected"];

      if (!allowedStatus.includes(status)) {
        res.status(400).json({
          message: "The status is not allowed",
        });
      }

      const request = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: req.user._id,
        status: "interested",
      });

      if (!request) {
        res.status(404).json({
          message: "Request not found",
        });
      }

      request.status = status;

      const data = await request.save();

      res.json({
        data: data,
      });
    } catch (er) {
      res.json({
        message: er.message,
      });
    }
  },
);

// to get all the pending request
requestRouter.get("/request/pending", userAuth, async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({
      toUserId: req.user._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);

    if (!requests) {
      res.status(404).json({
        message: "No pending request is there",
      });
    }

    res.status(200).json({
      data: requests,
      message: "Pending Request fetched successfully",
    });
  } catch (er) {
    res.status(500).json({
      message: er.message,
    });
  }
});

module.exports = requestRouter;
