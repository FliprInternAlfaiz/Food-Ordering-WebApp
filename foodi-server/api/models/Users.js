const mongoose = require('mongoose')
const { Schema } = mongoose;

//create Schema for Menu object 

const userSchema = new Schema({
   name:String,
   email:{
    type:String,
    trim:true,
    minlength:3
   },
   photoURL:String,
   role:{
    type:String,
    enum :['user','admin'],
    default:'user'
   }
})

//create Modal Object 

const User = mongoose.model("User", userSchema);

module.exports = User;