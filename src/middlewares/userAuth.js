const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;

    if (!token) {
      throw new Error("invalid Token");
    }
    const decodedToken = await jwt.verify(token, "shhhhh");

    const user = await User.findById({ _id: decodedToken._id });
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (er) {
    res.send(er.message);
  }
};

module.exports = { userAuth };
