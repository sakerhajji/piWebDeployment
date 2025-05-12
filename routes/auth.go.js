const express = require('express');
const router = express.Router();

const passport = require("passport");
const  generateTokenAndSetCookies  = require("../utilis/generateTokenAndSetCookies");

router.get('/google',
    passport.authenticate('google', { 
      scope: ['profile', 'email'],
      session: false ,
       prompt: 'consent'
    })
  );


  router.get(
    "/google/callback",
    passport.authenticate("google", {
      failureRedirect: "http://localhost:4000/login",
      session: false,
    }),
    (req, res) => {
      const user = req.user;
      const token = generateTokenAndSetCookies(res, user._id, user.role);
  
      // Redirige avec le token si tu veux en URL (sinon il est déjà en cookie)
      res.redirect(`http://localhost:4000`);
    }



    
  );


// Déclenche le login
router.get("/github", passport.authenticate("github", { session: false, 
  scope: ["read:user"],
  prompt: 'select_account' ,
  auth_type: "reauthenticate" 
}));

// Callback
router.get("/github/callback", passport.authenticate("github", {
  session: false,
  failureRedirect: "http://localhost:4000/login",
}), (req, res) => {
  const user = req.user;

  // Génére un JWT + Set-Cookie
  generateTokenAndSetCookies(res, user._id, user.role);

  // Redirection frontend
  res.redirect("http://localhost:4000");
});










module.exports = router;