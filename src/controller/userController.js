const userService = require('../services/userService')
const CryptoJS = require('crypto-js');
require('../firebase/index.js')
const nodemailer = require('nodemailer');
const  {google} = require('googleapis');
require('dotenv').config();
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URL = process.env.REDIRECT_URL
const REFRESH_TOKEN  = process.env.REFRESH_TOKEN 
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN})

const {getAuth} = require('firebase-admin/auth');
class UserController {
  async login(req, res, next) {
    const { encryptedData, encryptedKey } = req.body;
    const decryptedKey = encryptedKey;
    const bytes = CryptoJS.AES.decrypt(encryptedData, decryptedKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    const parsedData = JSON.parse(decryptedData);
    const userLogin = await userService.login(parsedData)
    res.json(userLogin)
  }
  async loginWithGoogle(req,res,next){
    const accessToken = req.body.accessToken;
    getAuth().verifyIdToken(accessToken).then(async(decodeToken)=>{
      const email = decodeToken?.email
      const name = decodeToken?.name
      const avatar = decodeToken?.picture
      const isEmailCreated =await userService.checkEmailIsCreated(email)
     if(isEmailCreated.status === 200){
      const user = await userService.loginWithGoogle(email)
          console.log({user})
     }else{
      const user = await userService.singUpWithGoogle(email,name,avatar)
      res.json(user)
     }

    })
  }
  async singUpWithGoogle(req,res){
    const accessToken = req.body.accessToken;
    getAuth().verifyIdToken(accessToken).then(async(decodeToken)=>{
      const email = decodeToken?.email
      const name = decodeToken?.name
      const avatar = decodeToken?.picture
      const isEmailCreated =await userService.checkEmailIsCreated(email)
     if(isEmailCreated.status === 200){
      const user = await userService.loginWithGoogle(email)
      console.log('ban da dang ki roi')
     }else{
      const user = await userService.singUpWithGoogle(email,name,avatar)
      res.json(user)
     }

    })

    
  }
  async singUpWithPhone(req,res){

   userService.signUpWithPhone(req.phone) 
  }
  async singUpWithEmail(){
     const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: "smtp.forwardemail.net",
      port: 465,
      secure: true,
      auth: {
        type:'Oauth2',
        user: 'dattqph28614@fpt.edu.vn',
        clientId: CLIENT_ID,
        clientSecret:CLIENT_SECRET,
        refreshToken:REFRESH_TOKEN,
        accessToken:accessToken,
      }
    });
    const mailOptions = {
  
      from: '<dattqph28614@fpt.edu.vn>',
      to: 'dath33603@gmail.com',
      subject: 'Verification',
      text: 'test mail lan 5'
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    
  }
  async singUp(req, res, next) {
    console.log(req.body)
    const user = await userService.singUp(req.body)
    res.json(user)

  }
  async getAllUsers(req, res, next) {
    const users = await userService.getAllUsers(req.body)
    res.json(users)

  }
  async getDetailUser(req, res, next) {
    const id = req.body.id
    const user = await userService.getDetailUser(id)
    res.json(user)

  }
  async deleteUser(req, res, next) {
    const id = req.body.id
    const user = await userService.deleteUser(id)
    res.json(user)
  }
}
module.exports = new UserController