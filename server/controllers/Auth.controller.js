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
      from: `Bakerywala.com <${process.env.EMAIL_FROM}>`,
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

exports.requireSignin = (req, res) => {
  return expressJwt({
    secret: process.env.JWT_SECRET,
  });
};

exports.adminMiddleware = (req, res, next) => {
  User.findById({
    _id: req.user._id,
  }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(400).json({
        error: "Admin resource. Access denied.",
      });
    }

    req.profile = user;
    next();
  });
};

exports.forgotPasswordController = (req, res) => {
  const { email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    User.findOne(
      {
        email,
      },
      (err, user) => {
        if (err || !user) {
          return res.status(400).json({
            error: "User with that email does not exist",
          });
        }

        const token = jwt.sign(
          {
            _id: user._id,
          },
          process.env.JWT_RESET_PASSWORD,
          {
            expiresIn: "10m",
          }
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
          from: `Bakerywala.com <${process.env.EMAIL_FROM}>`,
          to: email,
          subject: "Password Reset link",
          html: `
          <h1>Please use the following link to reset your password</h1>
          <p>${process.env.CLIENT_URL}/users/password/reset/${token}</p>
          <hr />
          <p>This email may contain sensetive information</p>
          <p>${process.env.CLIENT_URL}</p>
            `,
        };

        return user.updateOne(
          {
            resetPasswordLink: token,
          },
          (err, success) => {
            if (err) {
              console.log("RESET PASSWORD LINK ERROR", err);
              return res.status(400).json({
                error:
                  "Database connection error on user password forgot request",
              });
            } else {
              transporter.sendMail(messageOptions, (error, info) => {
                if (error) {
                  return res.json({
                    message: error.message,
                  });
                } else {
                  return res.json({
                    message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
                  })
                }
              });
            }
          }
        );
      }
    );
  }
};

exports.resetPasswordController = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    if (resetPasswordLink) {
      jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (
        err,
        decoded
      ) {
        if (err) {
          return res.status(400).json({
            error: "Expired link. Try again",
          });
        }

        User.findOne(
          {
            resetPasswordLink,
          },
          (err, user) => {
            if (err || !user) {
              return res.status(400).json({
                error: "Something went wrong. Try later",
              });
            }

            const updatedFields = {
              password: newPassword,
              resetPasswordLink: "",
            };

            user = _.extend(user, updatedFields);

            user.save((err, result) => {
              if (err) {
                return res.status(400).json({
                  error: "Error resetting user password",
                });
              }
              res.json({
                message: `Great! Now you can login with your new password`,
              });
            });
          }
        );
      });
    }
  }
};

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT);
// Google Login
exports.googleController = (req, res) => {
  const { idToken } = req.body;

  googleClient
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT })
    .then((response) => {
      // console.log('GOOGLE LOGIN RESPONSE',response)
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, name, role } = user;
            return res.json({
              token,
              user: { _id, email, name, role },
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            user = new User({ name, email, password });
            user.save((err, data) => {
              if (err) {
                console.log("ERROR GOOGLE LOGIN ON USER SAVE", err);
                return res.status(400).json({
                  error: "User signup failed with google",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );
              const { _id, email, name, role } = data;
              return res.json({
                token,
                user: { _id, email, name, role },
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: "Google login failed. Try again",
        });
      }
    });
};

exports.facebookController = (req, res) => {
  console.log("FACEBOOK LOGIN REQ BODY", req.body);
  const { userID, accessToken } = req.body;

  const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

  return (
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      // .then(response => console.log(response))
      .then((response) => {
        const { email, name } = response;
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, name, role } = user;
            return res.json({
              token,
              user: { _id, email, name, role },
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            user = new User({ name, email, password });
            user.save((err, data) => {
              if (err) {
                console.log("ERROR FACEBOOK LOGIN ON USER SAVE", err);
                return res.status(400).json({
                  error: "User signup failed with facebook",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );
              const { _id, email, name, role } = data;
              return res.json({
                token,
                user: { _id, email, name, role },
              });
            });
          }
        });
      })
      .catch((error) => {
        res.json({
          error: "Facebook login failed. Try later",
        });
      })
  );
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
