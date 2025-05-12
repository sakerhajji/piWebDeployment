const sendEmail = require("../services/mailService");
 const {VERIFICATION_EMAIL_TEMPLATE,WELCOME_EMAIL,PASSWORD_RESET_REQUEST_TEMPLATE,PASSWORD_RESET_SUCCESS_TEMPLATE} = require("./emailTemplates");


 const sendOTPEmail  = async (userEmail, otp) => {
    try{    sendEmail(
        userEmail,
        "2FA OTP",
        null,
        `${VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", otp)}`

    );


   }catch(error){
    console.error(`Error sending verification`, error);

		throw new Error(`Error sending verification email: ${error}`);
   }


 }

const  sendVerificationEmail= async (userEmail,verificationToken) => {
 try{    sendEmail(
        userEmail,
        "Verify your email",
        null,
        `${VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken)}`

    );


   }catch(error){
    console.error(`Error sending verification`, error);

		throw new Error(`Error sending verification email: ${error}`);
   }
};


const sendWelcomeEmail = async  (email, name) => {
    try{    sendEmail(
        email,
        "Welcome email",
        null,
        `${WELCOME_EMAIL.replace("{name}", name)}`

    );


   }catch(error){
    console.error(`Error sending verification`, error);

		throw new Error(`Error sending verification email: ${error}`);
   }
};


const sendPasswordResetEmail = async (email, url) =>{
    try{    sendEmail(
        email,
        "Reset your password",
        null,
        `${PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", url)}`

    );


   }catch(error){
    console.error(`Error sending verification`, error);

		throw new Error(`Error sending verification email: ${error}`);
   }
}

const sendResetSuccessEmail = async (email) => {
    try{    sendEmail(
        email,
        "Password Reset Successful",
        null,
        `${PASSWORD_RESET_SUCCESS_TEMPLATE}`

    );


   }catch(error){
    console.error(`Error sending verification`, error);

		throw new Error(`Error sending verification email: ${error}`);
   }
};
module.exports ={
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendResetSuccessEmail,
    sendOTPEmail
}