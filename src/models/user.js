const { JsonWebTokenError } = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt= require("bcrypt")

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 30,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate(val) {
        if (!validator.isEmail(val)) {
          throw new Error("Email is not valid");
        }
      },
    },

    gender: {
      type: String,
      lowercase: true,
      validate(val) {
        if (!["male", "female", "other"].includes(val)) {
          throw new Error("Please select correct gender");
        }
      },
    },

    about: {
      type: String,
      default: "this is about ",
    },
    skills: {
      type: [String],
    },
    password: {
      type: String,
      validate(val) {
        if (!validator.isStrongPassword(val)) {
          throw new Error("Password is not strong");
        }
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "shhhhh", {
    expiresIn: "1d",
  });

  return token;
};


userSchema.methods.validatePassword=  async function(passwordInputByUser)
{
  const user=this;
  const hashedPassword=user.password
   const isPassCorrect = await bcrypt.compare(passwordInputByUser, hashedPassword);
   return isPassCorrect;
}
const User = mongoose.model("User", userSchema);

module.exports = User;
