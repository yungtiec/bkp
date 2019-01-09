const passport = require("passport");
const router = require("express").Router();
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const { User, Role } = require("../db/models");
module.exports = router;

/**
 * For OAuth keys and other secrets, your Node process will search
 * process.env to find environment variables. On your production server,
 * you will be able to set these environment variables with the appropriate
 * values. In development, a good practice is to keep a separate file with
 * these secrets that you only share with your team - it should NOT be tracked
 * by git! In this case, you may use a file called `secrets.js`, which will
 * set these environment variables like so:
 *
 * process.env.GOOGLE_CLIENT_ID = 'your google client id'
 * process.env.GOOGLE_CLIENT_SECRET = 'your google client secret'
 * process.env.GOOGLE_CALLBACK = '/your/google/callback'
 */

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.log("Google client ID / secret not found. Skipping Google OAuth.");
} else {
  const googleConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
    passReqToCallback: true
  };

  const strategy = new GoogleStrategy(
    googleConfig,
    async (req, token, refreshToken, profile, done) => {
      const googleId = profile.id;
      const name = profile.displayName;
      const email = profile.emails[0].value;
      const firstName = profile.name ? profile.name.givenName : "";
      const lastName = profile.name ? profile.name.familyName : "";
      var user;
      req.session.googleAccessToken = token;

      try {
        if (req.user) {
          var updatedProfile = { googleId };
          if (req.session.syncAvatar) {
            updatedProfile.avatar_url = profile._json.image.url.replace(
              "sz=50",
              "sz=200"
            );
            req.session.syncAvatar = false;
          }
          user = await User.findById(req.user.id);
          user = await user.update(updatedProfile);
          done(null, user);
        } else {
          user = await User.find({
            where: { googleId },
            include: [{ model: Role }]
          });
          user
            ? done(null, user)
            : User.findOrCreate({
                where: { email },
                defaults: {
                  email,
                  googleId,
                  first_name: firstName,
                  last_name: lastName,
                  name: firstName + " " + lastName
                }
              }).spread(async (user, created) => {
                if (!created) user = await user.update({ googleId });
                user = await User.getContributions({
                  googleId,
                  includePrivateInfo: true
                });
                return done(null, user);
              });
        }
      } catch (err) {
        done(err);
      }
    }
  );

  passport.use(strategy);

  router.get(
    "/",
    (req, res, next) => {
      req.session.authRedirectPath = req.query.state;
      req.session.syncAvatar = req.query.syncAvatar;
      next();
    },
    passport.authenticate("google", { scope: ["email", "profile"] })
  );

  router.get(
    "/callback",
    passport.authenticate("google", {
      failureRedirect: "/login"
    }),
    (req, res) => {
      res.redirect(req.session.authRedirectPath);
    }
  );
}
