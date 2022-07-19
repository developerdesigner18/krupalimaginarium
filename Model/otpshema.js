const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
    email : {
        type :String,
        require : true
    },
    otp:{
        type : String,        
    },
    expiresIn : {
        type : Number
    }
},{timestamps : true})

module.exports = mongoose.model("otpdata",otpSchema);