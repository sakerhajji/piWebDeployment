const  GoogleStrategy = require('passport-google-oauth20').Strategy;
const GithubStrategy = require("passport-github2").Strategy;
require("dotenv").config();
const passport = require("passport");
const User = require("../models/user");
passport.use(new GoogleStrategy({
    clientID:  process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
 async function(accessToken, refreshToken, profile, done) {
    try {
      const email = profile.emails[0].value;
      const googleId = profile.id;

      let user = await User.findOne({ email });

      if (!user) {
        // Créer un nouvel utilisateur avec des données par défaut
        user = new User({
          googleId: googleId,
          firstname: profile.name.givenName || "Google",
          lastname: profile.name.familyName || "User",
          email: email,
          password: googleId, // ou une valeur par défaut car pas utilisée ici
          phoneNumber: "", // valeur par défaut à modifier plus tard
          age: 0, // valeur par défaut à modifier
          birthdayDate: new Date(), // valeur fictive
          role: "user",
          gender: "male", // valeur par défaut
          isVerified: true,
          avatar: profile.photos[0].value,
        });

        await user.save();
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/auth/github/callback",
        scope: ["read:user"],
      },
      async function(accessToken, refreshToken, profile, done) {
        try {
          const githubId = profile.id;
  
          // Recherche uniquement par githubId
          let user = await User.findOne({ githubId });
  
          if (!user) {
            user = new User({
              githubId: githubId,
              firstname: profile.displayName?.split(' ')[0] || "GitHub",
              lastname: profile.displayName?.split(' ').slice(1).join(' ') || "User",
              // Champ email facultatif ou vide
              email: "gfgfg",  
              password: githubId, 
              phoneNumber: "",
              age: 0,
              birthdayDate: new Date(),
              role: "user",
              gender: "male",
              isVerified: true,
              avatar: profile.photos?.[0]?.value || "",
            });
  
            await user.save();
          }
  
          return done(null, user);
        } catch (err) {
          console.error("GitHub auth error:", err);
          return done(err, null);
        }
      }
    )
  );

passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

