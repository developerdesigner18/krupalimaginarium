require('dotenv').config()
const Userdata = require("../Model/Usermodel");
const otpdata = require("../Model/otpshema");
const feedback = require('../Model/feedback')
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const sendEmail = require('../Model/Nodemail');
const otpGenerator = require('otp-generator');

//FOR CREATE TOKEN
const extime = 3 * 60 * 60;
const genratetoken = (_id) => {
  return jwt.sign({_id},process.env.JWT_SECRET_KEY,{
    expiresIn : extime 
  });
};

//FOR GENRATE THE OTP
const expireotp = 1 * 60;
const generateOTP = () => {  
  const OTP = otpGenerator.generate(6, {lowerCaseAlphabets:false, upperCaseAlphabets: false, specialChars: false },
    {expiresIn : expireotp});
  return OTP;
};

//post or create user
module.exports.signup = async (req, res) => {
  const { username, email, password, cpassword } = req.body;  
  try {
    if (!username || !email || !password || !cpassword) {
      res.status(400).json({message :"please enter a all details"});
    } else {
      if (!validator.isEmail(req.body.email)) {
        res.status(400).json({message :"please enter a valid email"});
      } else {
        const strongPassword = new RegExp(
          "(?=.*[a-z])(?=.*[0-9])(?=.*[^a-z0-9])(?=.{8,})"
        );
        if (!strongPassword.test(password.trim())) {
          return res.status(400).json({
            message:
              "Password must have 8 character include(alphabate,num and special character)",
          });
        } else {
          const person = await Userdata.findOne({ email: req.body.email });         
          if (!person) {
            if (req.body.password == req.body.cpassword) {
              const hashpassword = await bcrypt.hash(req.body.password, 10);
              const otp = generateOTP();            
              const hashotp = await bcrypt.hash(otp, 10);                                                       
              const newuser = await new Userdata({...req.body,password: hashpassword,otp : hashotp});
              newuser.save()
                .then(async (result) => {                  
                  const mailotp = `Verification otp : ${otp}`;                 
                  await sendEmail(req.body.email,'Verification OTP', mailotp);                  
                  setTimeout(async() =>{                   
                    const deleteotp = await Userdata.findByIdAndUpdate({_id:newuser._id},{ $unset: {otp: ''}})
                    if(deleteotp){
                      console.log("OTP is Expired--------------------");
                    }
                  },5 * 60 * 1000);                                      
                  return res.status(200).json({code :200,result, message: "User create successfully"});
                })
                .catch((error) => {
                  return res
                    .status(400)
                    .json({ code: 400, message: error.message });
                });
            } else {
              res.status(400).json({message :"password is not match"});
            }
          } else {
            res.status(400).json({message :"User is already registered"});
          }
        }
      }
    }
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};




//NEWUSER VERIFICATION
module.exports.verify = async(req,res)=>{
  try {
    const {otp}= req.body;
    const user = await Userdata.findOne({_id: req.params.id})  

    if(!user){
      return res.status(404).json({code:404,message:"User Is not found ! register First"})
    }
    if(!user.otp && user.active == false){
      const remove = await Userdata.findByIdAndDelete({_id:req.params.id});
      if(remove){
        return res.status(400).json({code:400,message:"OTP is expired Please signup again"})
      }
    }else{
      const validate = await bcrypt.compare(otp,user.otp)
      if(!validate){
        return res.status(400).json({code:400,message:"Wrong OTP"})
      }
      user.active = "true";
      await user.save().then(async(result)=>{        
        const deleteotp = await Userdata.findByIdAndUpdate({_id:user.id},{ $unset: {otp: ''}})
        return res.status(200).json({message:"User verified successfully"})  
      }).catch((err)=>{
        return res.status(500).json({message:err.message});
      })          
    }  
  } catch (error) {
    return res.status(500).json({code:500,message:error.message})
  }  
}




//FOR LOGIN USER
module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    if (!validator.isEmail(req.body.email)) {
      return res.status(404).json({message:"please enter a valid email"});
    }
    const userlogin = await Userdata.findOne({ email: email });
    if(!userlogin){
      return res.status(404).json({message:"User is not find please register first"});
    }
    if(!userlogin.otp && userlogin.active == false){
      const remove = await Userdata.findOneAndDelete({email});
      if(remove){
        return res.status(400).json({code:400,message:"OTP is expired Please signup again"})
      }
    }
    if(!userlogin.active == true){
      return res.status(404).json({message:"User is not verified "})
    }
    const validate = await bcrypt.compare(password, userlogin.password);
    if(!validate){
      return res.status(404).json({message:"please enter valid password"});
    }else{
      const token = genratetoken(userlogin._id);
          res.status(200).json({
            id: userlogin.id,
            email: userlogin.email,
            token: token,
            message: "User login successfully",
          });
    }       
};




//FOR SENDING LINK ON THE USER MAIL
module.exports.forgototp = async (req,res)=>{
 try {
    const {email} = req.body;
    const user = await Userdata.findOne({email});
    if(!user){
      return res.status(404).json({message:'User is not found !!'});
    }
    if(user.active == false){
      return res.status(400).json({code:400,message:"your User is not verified"});
    }
    const forgototp = generateOTP();
    const hashotp = await bcrypt.hash(forgototp,10);    
    const userdetail = await new otpdata({ 
      email : email,
      otp : hashotp      
    }).save()
    if(userdetail){
      try {                                
        const mailotp = `Forgot Password otp : ${forgototp}`;                 
        await sendEmail(req.body.email,'Forgot Password OTP', mailotp);                 
        setTimeout(async() =>{                   
          const deleteotp = await otpdata.findByIdAndDelete({_id:userdetail._id})
          if(deleteotp){
            console.log("OTP is Expired--------------------");
          }
        },5 * 60 * 1000);
        console.log('delete function call...............');        
        return res.status(200).json({code:200,message: 'OTP send to your registered Email'});
      } catch (error) {       
        return res.status(400).json({code:400,message : error.message})
      }    
    }    
 }
  catch (error) {
    return res.status(500).json({code:500,message:error.message})
  }
}




//FOR UPDATE THE NEW PASSWORD
module.exports.forgot = async (req,res)=>{
  try {
    const {otp,newpass,cnewpass} = req.body;
    
    const user = await otpdata.findById({_id : req.params.id})    
    if(!user){
      return res.status(404).json({message : "OTP is Invalid"})
    }
    const verify = await bcrypt.compare(otp,user.otp);
    if(!verify){
      return res.status(400).json({message:"Wrong OTP"});
    }
    const Email = user.email;
    const userdata = await Userdata.findOne({email : Email});
    if(!userdata){
      return res.status(404).json({message : error.message})
    }   
      //const remove = await otpdata.findByIdAndDelete({_id:user._id})        
      const strongPassword = new RegExp(
        "(?=.*[a-z])(?=.*[0-9])(?=.*[^a-z0-9])(?=.{8,})"
        );
        if (!strongPassword.test(newpass.trim())) {
          return res.status(400).json({message:"Password must have 8 character include(alphabate,num and special character)"});
        }
        if(newpass != cnewpass){
          return res.status(400).json({code:400,message:"new passwords are not match"});
        }else{       
        const hashpassword = await bcrypt.hash(newpass,10);
        await Userdata.findByIdAndUpdate(
          {_id:userdata._id},
          {$set:{password:hashpassword}},
          {new:true}
        ).then(async(result)=>{
          return res.status(200).json({result})
        }).catch((err)=>{
          return res.status(500).json({message:err.message});
        })
      }
    } catch (error) {
      return res.status(500).json({code:500,message:error.message})
  }
}




//FOR RESET PASSWORD AND USER UPDATE
module.exports.editprofile = async (req, res) => {
  try {
    const { username, email, fullname, oldpass, newpass, connewpass } = req.body;
    const imagepath = "http://localhost:8888/images/" + req.file.filename;
    const userdata = await Userdata.findById({ _id: req.user._id });
    if (!userdata) {
      return res.status(404).json({ code: 404, message: "User is not found" });
    }    
    const strongfullname = new RegExp("(?=.*[a-z])(?=.*[^a-z])(?=.{6,})");
    if (!strongfullname.test(fullname)) {
      return res.status(400).json({message:"Fullname must have 6 character include(alphabate and special character)"});
    }
    if (userdata.email == email) {
      if (!oldpass) {
        const data = Userdata.findByIdAndUpdate(
          userdata._id,
          {
            $set: {
              username: username,
              fullname: fullname,
              image: imagepath,
            },
          },
          { new: true }
        )
          .then(async (result) => {
            return res.status(200).json({ code: 200, data: result });
          })
          .catch((err) => {
            return res.status(500).json({ message: err.message });
          });
      } else {
        const validate = await bcrypt.compare(oldpass, userdata.password);
        if (!validate) {
          return res.status(404).json({ message: "Enter a valid password" });
        }
        const strongPassword = new RegExp(
          "(?=.*[a-z])(?=.*[0-9])(?=.*[^a-z0-9])(?=.{8,})"
        );
        if (!strongPassword.test(newpass)) {
          return res
            .status(400)
            .json({
              message:
                "Password must have 8 character include(alphabate,num and special character)",
            });
        }
        if (newpass != connewpass) {
          return res
            .status(400)
            .json({ code: 400, message: "new passwords are not match" });
        }
        const hashpassword = await bcrypt.hash(newpass, 10);
        const data = Userdata.findByIdAndUpdate(
          userdata._id,
          {
            $set: {
              username: username,
              fullname: fullname,
              image: imagepath,
              password: hashpassword,
            },
          },
          { new: true }
        )
          .then(async (result) => {
            return res.status(200).json({ code: 200, data: result });
          })
          .catch((err) => {
            return res.status(500).json({ message: err.message });
          });
      }
    } else {
      if (!validator.isEmail(req.body.email)) {
        return res.status(404).json({ message: "please enter a valid email" });
      }
      const find =  await Userdata.findOne({email:req.body.email})
      if(find){
        return res.status(400).json({code:400,message:"This UserEmail Is Already Exists"});
      }
      if (!oldpass) {
          const data = Userdata.findByIdAndUpdate(
            userdata._id,
            {  
              $set: {
                username: username,
                email: email,
                fullname: fullname,
                image: imagepath,
              },
            },
            { new: true }
          )
            .then(async (result) => {
              return res.status(200).json({ code: 200, data: result });
            })
            .catch((err) => {
              return res.status(500).json({ message: err.message });
            });
      } else {
          const validate = await bcrypt.compare(oldpass, userdata.password);
          if (!validate) {
            return res.status(404).json({ message: "Enter a valid password" });
          }
          const strongPassword = new RegExp(
            "(?=.*[a-z])(?=.*[0-9])(?=.*[^a-z0-9])(?=.{8,})"
          );
          if (!strongPassword.test(newpass)) {
            return res
              .status(400)
              .json({
                message:
                  "Password must have 8 character include(alphabate,num and special character)",
              });
          }
          if (newpass != connewpass) {
            return res
              .status(400)
              .json({ code: 400, message: "new passwords are not match" });
          }
          const hashpassword = await bcrypt.hash(newpass, 10);
          const data = Userdata.findByIdAndUpdate(
            userdata._id,
            {
              $set: {
                username: username,
                fullname: fullname,
                email: email,
                image: imagepath,
                password: hashpassword,
              },
            },
            { new: true }
          )
            .then(async (result) => {
              return res.status(200).json({ code: 200, data: result });
            })
            .catch((err) => {
              return res.status(500).json({ message: err.message });
            });
        }
    }  
  } catch (error) {
    return res.status(500).json({ code: 500, error: error.message });
  }
};




//FOR SELECTE LANGUAGE
module.exports.language = async (req,res)=>{     
  const user = await Userdata.findById({_id:req.user._id})
  if(user){
    await Userdata.findByIdAndUpdate(user._id,{$set:{language:req.body.language}},{runValidators: true,new:true})
    .then((result)=>{
      return res.status(200).json({code:200,message:result})
    }).catch((err)=>{
      return res.status(500).json({message:err.message});
    })              
  }
}




//FOR FEEDBACK
module.exports.feedback = async(req,res)=>{
  try {
    const {type,question,describe}= req.body;    
    const user = await Userdata.findById({_id:req.user._id})  
    const newfeedback = await new feedback({User_id:user._id,email : user.email,question,describe,type});    
    newfeedback.save().then((result)=>{
      return res.status(200).json({code:200,message:"feedback send successfully",data:newfeedback})      
    }).catch((err)=>{
      return res.status(500).json({message:err.message});
    })              
  } catch (error) {
    return res.status(500).json({code:500,error : error.message});
  }  
}