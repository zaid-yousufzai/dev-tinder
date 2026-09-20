const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth");
const { validateProfileEditData } = require("../config/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (er) {
    res.send(er.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    //alowed key
    const isEditAllowed = validateProfileEditData(req);
    if (!isEditAllowed) {
      throw new Error("You are trying to edit un authize field");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((k) => {
      loggedInUser[k] = req.body[k];
    });

    await loggedInUser.save();
    res.json({
      message: "user updated successfullu",
      data: loggedInUser,
    });
  } catch (er) {
    res.send(er.message);
  }
});

module.exports = profileRouter;

// app.get("/profile", userAuth,async(req,res)=>
// {
//   try{

// const user = req.user;
//     res.send(user)

//   }
//   catch(er)
//   {
//     res.send(er.message)
//   }
// })

// update

// app.patch("/updateUser/:id", async (req, res) => {
//   try {
//     console.log(req.body);
//     const AllowedFields = [
//       "firstName",
//       "lastName",
//       "gender",
//       "about",
//       "password",
//       "skills",
//     ];

//     const isAllowed = Object.keys(req.body).every((k) => {
//       return AllowedFields.includes(k);
//     });

//     console.log(isAllowed);

//     if (!isAllowed) {
//       throw new Error("the field you are trying to update is not allowed");
//     }
//     if (req.body?.skills.length > 3) {
//       throw new Error("You cannot add more than 3 skills");
//     }
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { $set: req.body },
//       {
//         new: true,
//         runValidators: true,
//       },
//     );

//     if (!user) {
//       return res.status(404).send("User not found");
//     }

//     res.send({
//       message: "User updated successfully",
//       user,
//     });
//   } catch (err) {
//     res.status(400).send({
//       message: "Something went wrong",
//       error: err.message,
//     });
//   }
// });
