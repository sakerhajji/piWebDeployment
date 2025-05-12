const {sendPasswordResetEmail,sendResetSuccessEmail} = require("../utilis/email");
const crypto = require("crypto");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");

const forgetPassword = async (req,res) => {
    const { email } = req.body;
    try{
      const user = await User.findOne({ email });
  
          if (!user) {
              return res.status(400).json({ success: false, message: "User not found" });
          }
     const resetToken = crypto.randomBytes(20).toString("hex");
     const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
     user.resetPasswordToken = resetToken;
     user.resetPasswordExpiresAt = resetTokenExpiresAt;
  
     await user.save();
     await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
      res.status(200).json({ success: true, message: "Password reset link sent to your email" });
    }catch(error){
      res.status(400).json({ success: false, message: error.message });
    }
  
  }



  const resetPassword = async (req, res) => {

    try{

      const { token } = req.params;
		  const { password } = req.body;

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpiresAt: { $gt: Date.now() },
      });
       
      
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

    // update password
		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();
    await sendResetSuccessEmail(user.email);
    res.status(200).json({ success: true, message: "Password reset successful" });
    }catch(error){
      res.status(400).json({ success: false, message: error.message });
    }
};

const resendForgetPasswordEmail = async (req, res) => {
  const { email } = req.body;

  try {
      
      if (!email) {
          return res.status(400).json({ success: false, message: "Email is required" });
      }

      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          return res.status(400).json({ success: false, message: "Invalid email format" });
      }

    
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

     
      if (user.resetPasswordToken && user.resetPasswordExpiresAt > Date.now()) {
         
          user.resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 heure
          await user.save();
         
          await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${user.resetPasswordToken}`);
          
          return res.status(200).json({ 
              success: true, 
              message: "Password reset link resent successfully" 
          });
      }

      const resetToken = crypto.randomBytes(20).toString("hex");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000; 
      await user.save();

      // Envoyer le nouvel email
      await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

      res.status(200).json({ 
          success: true, 
          message: "New password reset link sent to your email" 
      });

  } catch (error) {
      console.error("Error in resendForgetPasswordEmail:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
};







module.exports = {forgetPassword,resetPassword,resendForgetPasswordEmail}