
const nodemailer = require("nodemailer");
const express = require("express")
require("dotenv").config();


const otpRouter = express.Router()

// NODEMAILER TRANSPORTS CONFIGURATION
const trasports = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jackayron5@gmail.com",
    pass: process.env.PASS,
  },
});
// OTP GENERATRO
function otpgenerator() {
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

otpRouter.get("/get-otp", async (req, res) => {
  const { email } = req.body; // person's email to which we want to send otp
  const otp = otpgenerator();
  trasports
    .sendMail({
      to: email,
      from: "jackayron5@gmail.com",
      subject: "OTP verification",
      text: `Your OTP for login is ${otp}`,
    })
    .then((result) => {
      console.log(result);
      req.session.OTP = otp;
      console.log(req.session.OTP, "LINE 57");
      res.send("Email sent");
    })
    .catch((err) => {
      console.log(err);
      console.log(err.message);
      res.send("Something wrong happend");
    });
});

otpRouter.get("/verify-otp", async (req, res) => {
  const { OTP } = req.query;
  const serverOtp = req.session.OTP;
  console.log(req.session);
  console.log(OTP, serverOtp);
  if (OTP == serverOtp) {
    res.send("OTP verified");
  } else {
    res.send("Wrong otp");
  }
});

module.exports = {
    otpRouter
}