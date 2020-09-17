const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    contactNum:{
        type:Number,
    },
    email:{
        type:String,
        required:true,
        unique:true
    }
},{timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }});

const User = mongoose.model("User", UserSchema);

module.exports = User;
