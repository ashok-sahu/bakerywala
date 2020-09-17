const jwt = require("jsonwebtoken");
const chalk = require("chalk");
const User = require("../models/userModel");

exports.signUp = async (req, res) => {
  console.log(req.body, "body");
  await User.findOne({ email: req.body.email }).exec((error, user) => {
    if (user) {
      return res.status(400).json({
        status: "failed",
        message: "User is already exists",
      });
    }

    const { firstName, lastName, contactNum, email } = req.body;
    console.log(req.body, "req.body");

    const newUser = new User({
      firstName,
      lastName,
      contactNum,
      email,
    });

    newUser.save((err, data) => {
      if (err) {
        return res.status(400).json({
          status: "failed",
          message: "error while adding user",
        });
      }

      if (data) {
        return res.status(201).json({
          status: "success",
          message: "new user added successfully",
          data: data,
        });
      }
    });
  });
};

exports.login = async (req, res, next) => {};

exports.userList = async (req, res) => {
  const userlist = await User.find();
  try {
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: userlist.length,
      data: userlist,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: "userList is empty",
      data:err
    });
  }
};
