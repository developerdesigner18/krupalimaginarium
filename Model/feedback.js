const mongoose = require("mongoose");

//User schema
const feedback = mongoose.Schema(
  {
    User_id:String,
    email:{
        type:String,
        require:true
    },
    type :{      
        type: String,
        enum : ['feedback','feature request','issue'],
        default: 'feature request'
    },
    question :{
        type: String,
        require: true
    },
    describe :{
        type: String,
        require : true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("feedback", feedback);
