const express = require("express");
const { connection } = require("./config/db");
const { userRoute } = require("./routes/userRoute.routes");
// const { auth } = require("./midleware/auth.middleware");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");
const { otpRouter } = require("./routes/otproutes.routes");
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
const port = process.env.port;
require("dotenv").config();


// this is the home route---
app.get("/", (req, res) => {
  res.send("home page");
});

// attaching the user login and register routes----
app.use("/users", userRoute);
app.use(
  session({
    resave: true,
    secret: "your secret",
    saveUninitialized: true,
  })
);


// app.use(auth)
// app.get("/check",async(req,res)=>{
//   try {
//     res.status(200).send({success:"successful"})
//   } catch (error) {
//     res.status(404).send({err:error})
//   }
  
// })

// listening and creating the mongosse connection
app.listen(port, async () => {
  try {
    await connection;
    console.log("Db is connected");
  } catch (error) {
    console.log({ err: error });
  }
  console.log(`server is running at port ${port}`);
});
