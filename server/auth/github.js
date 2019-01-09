const passport = require("passport");
const router = require("express").Router();
const GitHubStrategy = require("passport-github").Strategy;
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

if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
  console.log("Github client ID / secret not found. Skipping Github OAuth.");
} else {
  const githubConfig = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK,
    passReqToCallback: true
  };

  const strategy = new GitHubStrategy(
    githubConfig,
    async (req, token, refreshToken, profile, done) => {
      const githubId = profile.id;
      const displayName = profile.username;
      const name = profile._json.name;
      const firstName = name ? name.split(" ")[0] : null;
      const lastName = name ? name.split(" ")[1] : null;
      const email = profile.email;
      var user;
      req.session.githubAccessToken = token;

      try {
        if (req.user) {
          var updatedProfile = { githubId };
          if (req.session.syncAvatar) {
            updatedProfile.avatar_url = profile._json.avatar_url;
            req.session.syncAvatar = false;
          }
          user = await User.findById(req.user.id);
          user = await user.update(updatedProfile);
          done(null, user);
        } else {
          user = await User.find({
            where: { githubId },
            include: [{ model: Role }]
          });
          user
            ? done(null, user)
            : User.findOrCreate({
                where: { email },
                defaults: {
                  email,
                  displayName,
                  githubId,
                  first_name: firstName,
                  last_name: lastName,
                  name: name
                }
              }).spread(async (user, created) => {
                if (!created) user = await user.update({ githubId });
                user = await User.getContributions({
                  githubId,
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
    passport.authenticate("github", { scope: ["email", "profile"] })
  );

  router.get(
    "/callback",
    passport.authenticate("github", {
      failureRedirect: "/login"
    }),
    (req, res) => {
      if (!req.user.name.trim()) res.redirect("/user/profile/about");
      else res.redirect(req.session.authRedirectPath);
    }
  );
}
