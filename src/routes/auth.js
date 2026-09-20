const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    //limit to skills
    if (req.body?.skills.length > 3) {
      throw new Error("You cannot add skills more than 3");
    }

    // create hash password

    const hashPassword = await bcrypt.hash(req.body.password, 10);
    //instance of user model with reqbody
    const user = new User({
      ...req.body,
      password: hashPassword,
    });

    // save to db

    await user.save();

    //send response

    res.send("User sign up successfully");
  } catch (er) {
    res.send(er.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("User not found");
    }
    const isPassValid = await user.validatePassword(password);
    if (!isPassValid) {
      throw new Error("Invalid Credentials");
    }

    const token = await user.getJWT();
    res.cookie("token", token, { expires: new Date(Date.now() + 900000) });
    res.send("login success");
  } catch (er) {
    res.send(er.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Logout Success");
  } catch (er) {
    res.send(er.message);
  }
});

module.exports = authRouter;
