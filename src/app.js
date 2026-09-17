const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const { dbConnect } = require("./config/database");
const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt")

app.use(express.json());
// Serve Swagger documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

dbConnect()
  .then(() => {
    app.listen(5000, () => {
      console.log("App is running on 5000");
    });
  })
  .catch((err) => console.log(err));

/**
 * @swagger
 * /signup:
 *   get:
 *     summary: Create user account
 *     responses:
 *       200:
 *         description: Success
 */

// sign up api
app.post("/signup", async (req, res) => {
  try {
    // Check maximum number of skills
    if (req.body?.skills?.length > 3) {
      throw new Error("You cannot add more than 3 skills");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create user with hashed password
    const user = new User({
      ...req.body,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).send({
      message: "User created successfully",
      user,
    });
  } catch (er) {
    res.status(400).send({
      message: "Bad request",
      error: er.message,
    });
  }
});

// get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (er) {
    res.send("Something went wrong", er);
  }
});

// get specific user

app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ firstName: req.body.firstName });
    res.send(user);
  } catch (er) {
    res.send("Something went wrong", er);
  }
});

//delete the user

app.delete("/user", async (req, res) => {
  try {
    const user = await User.deleteOne({ firstName: req.body.firstName });
    res.send("User deleted", user);
  } catch (er) {
    res.status(500).send("Something went wrong", er);
  }
});

// update

app.patch("/updateUser/:id", async (req, res) => {
  try {
    console.log(req.body);
    const AllowedFields = [
      "firstName",
      "lastName",
      "gender",
      "about",
      "password",
      "skills",
    ];

    const isAllowed = Object.keys(req.body).every((k) => {
      return AllowedFields.includes(k);
    });

    console.log(isAllowed);

    if (!isAllowed) {
      throw new Error("the field you are trying to update is not allowed");
    }
    if (req.body?.skills.length > 3) {
      throw new Error("You cannot add more than 3 skills");
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send({
      message: "User updated successfully",
      user,
    });
  } catch (err) {
    res.status(400).send({
      message: "Something went wrong",
      error: err.message,
    });
  }
});

// login api

app.post("/login", async(req,res)=>
{
  try{

    const {emailId,password}=req.body;
    const user= await User.findOne({emailId: emailId})
    if(!user)
    {
      throw new Error("User not found")
    }
    const isPassCorrect= await bcrypt.compare(password,user.password);
    if(!isPassCorrect)
    {
      throw new Error("Password is incorrect")
    }

    else
    {
      res.send("login success")
    }
  }
  catch(er)
  {
    res.send({
      message :" Something went wrong",
     error: er.message
    })
  }
})