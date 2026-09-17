const mongoose = require("mongoose");
const validator =require("validator")

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
      validate(val){
        if(!validator.isEmail(val))
        {
          throw new Error("Email is not valid")
        }
      }
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
      validate(val){
        if(!validator.isStrongPassword(val))
        {
          throw new Error("Password is not strong")
        }
      }
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
