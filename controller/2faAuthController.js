const User = require("../models/user");

const  generateTokenAndSetCookies  = require("../utilis/generateTokenAndSetCookies");
const toggle2FA = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.is2FAEnabled = !user.is2FAEnabled;
        await user.save();

        res.status(200).json({
            success: true,
            message: `2FA ${user.is2FAEnabled ? 'enabled' : 'disabled'} successfully`,
            is2FAEnabled: user.is2FAEnabled
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const verifyOTP = async (req, res) => {
    const { userId, otp } = req.body;

    try {
        if (!userId || !otp) {
            return res.status(400).json({ success: false, message: "User ID and OTP are required" });
        }

        const user = await User.findOne({
            _id: userId,
            otp,
            otpExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        // OTP valide, connecter l'utilisateur
        generateTokenAndSetCookies(res, user._id, user.role);
        user.lastLogin = new Date();
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    toggle2FA,
    verifyOTP
};