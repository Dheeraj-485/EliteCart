// const { User } = require('../model/User');
// const crypto = require('crypto');
const { sanitizeUser, sendMail } = require('../services/common');
// const jwt = require('jsonwebtoken');

const { User } = require("../model/User");

// exports.createUser = async (req, res) => {
//   try {
//     const salt = crypto.randomBytes(16);
//     crypto.pbkdf2(
//       req.body.password,
//       salt,
//       310000,
//       32,
//       'sha256',
//       async function (err, hashedPassword) {
//         const user = new User({ ...req.body, password: hashedPassword, salt });
//         const doc = await user.save();

//         req.login(sanitizeUser(doc), (err) => {
//           // this also calls serializer and adds to session
//           if (err) {
//             res.status(400).json(err);
//           } else {
//             const token = jwt.sign(
//               sanitizeUser(doc),
//               process.env.JWT_SECRET_KEY
//             );
//             res
//               .cookie('jwt', token, {
//                 expires: new Date(Date.now() + 3600000),
//                 httpOnly: true,
//               })
//               .status(201)
//               .json({ id: doc.id, role: doc.role });
//           }
//         });
//       }
//     );
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };

// exports.loginUser = async (req, res) => {
//   const user = req.user;
//   res
//     .cookie('jwt', user.token, {
//       expires: new Date(Date.now() + 3600000),
//       httpOnly: true,
//     })
//     .status(201)
//     .json({ id: user.id, role: user.role });
// };

exports.logout = async (req, res) => {
  res
    .cookie('jwt', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .sendStatus(200)
};

exports.checkAuth = async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
};

exports.resetPasswordRequest = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });
  if (user) {
    const token = crypto.randomBytes(48).toString('hex');
    user.resetPasswordToken = token;
    await user.save();

    // Also set token in email
    const resetPageLink =
      'http://localhost:3000/reset-password?token=' + token + '&email=' + email;
    const subject = 'reset password for e-commerce';
    const html = `<p>Click <a href='${resetPageLink}'>here</a> to Reset Password</p>`;

    // lets send email and a token in the mail body so we can verify that user has clicked right link

    if (email) {
      const response = await sendMail({ to: email, subject, html });
      res.json(response);
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(400);
  }
};

// exports.resetPassword = async (req, res) => {
//   const { email, password, token } = req.body;

//   const user = await User.findOne({ email: email, resetPasswordToken: token });
//   if (user) {
//     const salt = crypto.randomBytes(16);
//     crypto.pbkdf2(
//       req.body.password,
//       salt,
//       310000,
//       32,
//       'sha256',
//       async function (err, hashedPassword) {
//         user.password = hashedPassword;
//         user.salt = salt;
//         await user.save();
//         const subject = 'password successfully reset for e-commerce';
//         const html = `<p>Successfully able to Reset Password</p>`;
//         if (email) {
//           const response = await sendMail({ to: email, subject, html });
//           res.json(response);
//         } else {
//           res.sendStatus(400);
//         }
//       }
//     );
//   } else {
//     res.sendStatus(400);
//   }
// };
    
exports.resetPassword=async(req,res)=>{
  const {email,password,token}=req.body;
  const user=await User.findOne({email:email,resetPasswordToken:token});
  if(!user){
return res.status(404).json({message:"Token is wrong or email is invalid"});
  }
  const hash=await bcrypt.hash(password,10);
user.password=hash;
await user.save();
const subject = 'password successfully reset for e-commerce';
        const html = `<p>Successfully able to Reset Password</p>`;
        if (email) {
          const response = await sendMail({ to: email, subject, html });
          res.json(response);
        } else {
          res.sendStatus(400);
        }


}

const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const crypto=require('crypto')

exports.createUser=async(req,res)=>{

  try {
    const {name,email,password,addresses}=req.body;
     const checkUser=await User.findOne({email});
     if(checkUser){
      res.status(401).json({message:"USer already exists"});
     };

     const hash=await bcrypt.hash(password,10);
     const newuser=new User({
      email,
      password:hash,
      addresses,
      name
     })
     await newuser.save();
    return  res.status(200).json({message:"User saved successfully",newuser})


  } catch (error) {
    console.error("Error creating user",error.message)
    return res.status(500).json({message:"Error creating user",error:error.message})
  }

}

exports.loginUser=async(req,res) => {
  try {
    const {email,password} = req.body;
    const user=await User.findOne({email});
    if(!user){
      return res.status(404).json({message: 'Email not found'})
    }
//     const checkpassword=await bcrypt.compare(user.password,password);
//     if(!checkpassword){
//       return res.status(400).json({message: 'Password not match'})
//     }

//     const token=jwt.sign({id:user.id,email:user.email},"SECRET",{expiresIn:"24h"})
     
//  user.token=token;
//  user.password=undefined


//  const options = {
//   expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//   httpOnly: true,
// }
// res.cookie("token", token, options).status(200).json({
//   success: true,
//   token,
//   user,
//   message: `User Login Success`,
// })

if (await bcrypt.compare(password, user.password)) {
  const token = jwt.sign(
    { email: user.email, id: user.id,role:user.role },
    "SECRET",
    {
      expiresIn: "24h",
    }
  )

  // Save token to user document in database
  user.token = token
  user.password = undefined
  // Set cookie for token and return success response
  const options = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  }
  res.cookie("token", token, options).status(200).json({
    success: true,
    token,
    user,
    message: `User Login Success`,
  })
} else {
  return res.status(401).json({
    success: false,
    message: `Password is incorrect`,
  })
}
  } catch (error) {
    console.error(error)
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    })
  }
}
