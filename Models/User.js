//1. Create User Schema
const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    name:String,
    password:{
        type:String
    },
    role:String,
    email:String
},{ timestamps:true })

module.exports = mongoose.model('users',userSchema)