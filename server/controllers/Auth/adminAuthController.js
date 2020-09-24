const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const validator = require('validator')

const UserSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
        min:5,
        max:20
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        min:5,
        max:20
    },
    userName:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        index:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'please provide a valid email']
    },
    contactNum:{

    },
    profilePic:{

    },
    role:{

    }

});

const User = mongoose.model("User", UserSchema);

module.exports = User;
