const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const { dbConnect } = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter=require("./routes/auth")
const userRouter=require("./routes/user");
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/request");


app.use(express.json());
app.use(cookieParser());
// Serve Swagger documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));


app.use("/",authRouter)
app.use("/",userRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);

dbConnect()
  .then(() => {
    app.listen(5000, () => {
      console.log("App is running on 5000");
    });
  })
  .catch((err) => console.log(err));
