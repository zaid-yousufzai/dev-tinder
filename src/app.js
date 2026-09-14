const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const { dbConnect } = require("./config/database");
const app = express();
const User = require("./models/user");

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

app.post("/signup", async (req, res) => {
  try {
    const data = {
      firstName: "Zaid",
      lastName: "Khan",
      emailId: "zaid@gmail.com",
      password: "xxxxxx",
    };
    const newuser = new User(data);
    const result = await newuser.save();
    res.send("User added successfully", result);
  } catch (er) {
    res.status(400).send("bad request", er);
  }
});
