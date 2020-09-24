const User = require("../models/userModel");
const expressJwt = require("express-jwt");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.MAIL_KEY)

const nodemailer = require('nodemailer')
//custom error handers
const { errorHandler } = require("../helpers/dbErrorHandling");

exports.registerUser = (req, res) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req)

  if(!errors.isEmpty()){
      const firstError = errors.array().map(error=>error.msg)[0]
      return res.status(422).json({
          error:firstError
      })
  }else{
      User.findOne({email}).exec((err,user)=>{
          //if user exists
          if(user){
              return res.status(400).json({
                  error:'Email is Taken'
              })
          }
      })

      //generate a token
      const token = jwt.sign({
          name,email,password
      },process.env.JWT_ACCOUNT_ACTIVATION,{expiresIn:'15m'})

      let transporter = nodemailer.createTransport({
        host: "smtp.googlemail.com",
        port: 587,
        secure:false,
        auth: {
          user: "ashoksahu1105@gmail.com",
          pass: "ashok$1111",
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

    //   let to_email = req.body.to_email;
    //   let mail_subject = req.body.mail_subject;
    //   let message = req.body.message;
    //   let attach = req.body.attach;
      let messageOptions = {
        from: `ashoksahu <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Account Activation Link',
        // text: message
        html: `
        <h1> Please Click The Link To Active </h1>
        <p> ${process.env.CLIENT_URL}/users/active/${token} </p>
        <hr/>
        <p>This Email contains Sensetive Info</p>
        <p>${process.env.CLIENT_URL}</p>
        `,
      };
    //   if (attach) {
    //     messageOptions = {
    //       ...messageOptions,
    //       attachments: [
    //         {
    //           filename: "Promotion.jpg",
    //           path: "./Promotion.jpg",
    //         },
    //       ],
    //     };
    //   }
      transporter.sendMail(messageOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Message %s sent: %s", info.messageId, info.response);
        res.redirect("/");
      })

      //email data sending
    //   const emaildata = {
    //       from:process.env.EMAIL_FROM,
    //       to:email,
    //       subject:'Account Activation Link',
    //       html:`
    //       <h1> Please Click The Link To Active </h1>
    //       <p> ${process.env.CLIENT_URL}/users/active/${token} </p>
    //       <hr/>
    //       <p>This Email contains Sensetive Info</p>
    //       <p>${process.env.CLIENT_URL}</p>
    //       `
    //   }
    //   sgMail.send(emaildata).then(sent=>{
    //       return res.json({
    //           message:`Email has been sent to ${email}`
    //       })
    //   }).catch(error=>{
    //       return res.status(400).json({
    //           error:errorHandler(error)
    //       })
    //   })
  }
};
