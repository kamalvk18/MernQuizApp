const mongoose = require('mongoose')
var passportLocalMongoose = require("passport-local-mongoose")

const Userschema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
  
    email:{
        type:String,
        required:true
    },
    
    password:{
        type:String,
        required:true
    },
    
    phone:Number,
    
    college:{   
        type:String,
        required:true
    },
    
    occupation:{
        type:String,
        required:true
    },
  
    quizzesAttempted:[{
        type:mongoose.Schema.Types.ObjectId,
		ref:"result"
    }],
  })

Userschema.plugin(passportLocalMongoose, { usernameField: 'email' });
module.exports = mongoose.model("user", Userschema)