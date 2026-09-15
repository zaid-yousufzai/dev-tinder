const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const { dbConnect } = require("./config/database");
const app = express();
const User = require("./models/user");

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
    const user = new User(req.body);
    await user.save();
    res.status(201).send("User created successfully", user);
  } catch (er) {
    res.status(400).send("bad request", er);
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

app.path("/updateUser", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { firstName: req.body.firstName },
      { firstName: req.body.newFirstName, lastName: req.body.newLastName },
    );
    res.send("User updated successfully", user);
  } catch (er) {
    res.send("Something went wrong");
  }
});
