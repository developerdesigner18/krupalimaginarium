const mongoose = require("mongoose");

//User schema
const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    fullname: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      require: true,
    },
    language :{      
        type: String,
        enum : ['English','Gujarati','Hindi','French','Spenish','German','Russian'],
        default: 'English'
    },    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Userdata", UserSchema);
