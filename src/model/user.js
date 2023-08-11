const mongoose = require('mongoose');
mongoose.set('strictQuery', false)
const Schema = mongoose.Schema;
const user = new Schema({
  email: { type: String, required: true},
  passWord: { type: String},
  phone:{type: String, default:null},
  fullName: { type: String},
  avatar:{type:String,default:'hihu'},
  isAdmin: { type:Boolean,default: false},
  refresh_token: { type: String}
},{timestamps:true});

module.exports = mongoose.model('users',user);
