const mongoose = require("mongoose");
// const { authenticate } = require("passport");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: String,
      default: "admin",
      //we have more type (normal,user...)
    },
    resetPasswordLink: {
      data: String,
      default: "",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//virtual password
UserSchema.virtual("password")
  .set(function (password) {
    //set password note you must use normal function not arrow function
    this.password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

//methods
UserSchema.methods = {
  //generate salt
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random() + "");
  },
  //encrypt password
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  //compare password between plain get from user and hashed
  authenticate: function (plainPassword) {
    return this.encryptPassword(plainPassword) === this.hashed_password;
  },
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
