
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const  generateTokenAndSetCookies  = require("../utilis/generateTokenAndSetCookies");
const crypto = require("crypto");
const { sendOTPEmail } = require("../utilis/email");


const login = async (req,res) => {
    const {email,password} = req.body;
      try{
        console.log(`${email} ${password}`);
           if(!email || !password){
            throw new Error("All input required !!");
           }
           const user = await User.findOne({email});
           if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
          }
  
          const isPasswordValid = await bcryptjs.compare(password, user.password);
             if (!isPasswordValid) {
                 return res.status(400).json({ success: false, message: "Invalid credentials" });
              }
          // Vérifier si l'utilisateur a activé le 2FA
        if (user.is2FAEnabled) {
          // Générer un OTP
          const otp = crypto.randomInt(100000, 999999).toString();
          const otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

          // Sauvegarder l'OTP dans l'utilisateur
          user.otp = otp;
          user.otpExpiresAt = otpExpiresAt;
          await user.save();

          // Envoyer l'OTP par email
          await sendOTPEmail(user.email, otp);

          return res.status(200).json({ 
              success: true, 
              message: "OTP sent to your email", 
              requires2FA: true,
              tempUserId: user._id // Envoyer l'ID temporaire pour la vérification OTP
          });
      }
  
          generateTokenAndSetCookies(res, user._id,user.role);
  
          user.lastLogin = new Date();
               await user.save();
  
           res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
              ...user._doc,
              password: undefined,
            },
          });
      }catch(error){
  
        res.status(400).json({ success: false, message: error.message });
      }
  }


  const logout = async (req,res) => {
    res.clearCookie("token", {
      httpOnly: true, 
      secure: false, // À enlever si tu es en développement sans HTTPS
      sameSite: "Strict",
      path: "/",
    });
    res.clearCookie("connect.sid"); 
   
      res.status(200).json({ success: true, message: "Logged out successfully" });
  }


  const checkAuth = async (req, res) => {
    try{
      const user = await User.findById(req.userId).select("-password");
          if (!user) {
              return res.status(400).json({ success: false, message: "User not found" });
          }
  
          res.status(200).json({ success: true, user });
    }catch(error){
      console.log("Error in checkAuth ", error);
          res.status(400).json({ success: false, message: error.message });
    }
  }
// Export all functions
module.exports = {
    login,
    logout,
    checkAuth
};