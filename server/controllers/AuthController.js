const User = require("../models/userModel");
const client = require("../config/TwilioConfig");
const expressJwt = require("express-jwt");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const TwilioSms = require("twilio")(client.accountSID, client.authToken);
const nodemailer = require("nodemailer");
//custom error handers
const { errorHandler } = require("../helpers/dbErrorHandling");
const twilio = require("twilio");
exports.registerController = (req, res) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    User.findOne({ email }).exec((err, user) => {
      //if user exists
      if (user) {
        return res.status(400).json({
          error: "Email is Taken",
        });
      }
    });

    //generate a token
    const token = jwt.sign(
      {
        name,
        email,
        password,
      },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "15m" }
    );

    let transporter = nodemailer.createTransport({
      host: "smtp.googlemail.com",
      port: 587,
      secure: false,
      auth: {
        user: "ashoksahu1105@gmail.com",
        pass: "ashok$1111",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let messageOptions = {
      from: `ashoksahu <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Account Activation Link",
      html: `
        <h1> Please Click The Link To Active </h1>
        <p> ${process.env.CLIENT_URL}/users/activate/${token} </p>
        <hr/>
        <p>This Email contains Sensetive Info</p>
        <p>${process.env.CLIENT_URL}</p>
        `,
    };
    transporter.sendMail(messageOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message %s sent: %s", info.messageId, info.response);
      res.redirect("/");
    });
  }
};

//activation and save to database
exports.activationController = (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
      if (err) {
        console.log("Activation error");
        return res.status(401).json({
          errors: "Expired link. Signup again",
        });
      } else {
        const { name, email, password } = jwt.decode(token);

        console.log(email);
        const user = new User({
          name,
          email,
          password,
        });

        user.save((err, user) => {
          if (err) {
            console.log("Save error", errorHandler(err));
            return res.status(401).json({
              errors: errorHandler(err),
            });
          } else {
            return res.json({
              success: true,
              data: user,
              message: "Signup success",
            });
          }
        });
      }
    });
  } else {
    return res.json({
      message: "error happening please try again",
    });
  }
};

exports.signinController = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    // check if user exist
    User.findOne({
      email,
    }).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          errors: "User with that email does not exist. Please signup",
        });
      }
      // authenticate
      if (!user.authenticate(password)) {
        return res.status(400).json({
          errors: "Email and password do not match",
        });
      }
      // generate a token and send to client
      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      const { _id, name, email, role } = user;

      return res.json({
        token,
        user: {
          _id,
          name,
          email,
          role,
        },
      });
    });
  }
};

exports.sendOtp = (req, res) => {
  TwilioSms.verify
    .services(client.serviceID)
    .verifications.create({
      to: `+${req.query.phonenumber}`,
      channel: req.query.channel,
    })
    .then((data) => res.status(200).send(data));
};

exports.verifyOtp = (req, res) => {
  TwilioSms.verify
    .services(client.serviceID)
    .verificationChecks.create({
      to: `+${req.query.phonenumber}`,
      code: req.query.code,
    })
    .then((data) => res.status(200).send(data));
};
