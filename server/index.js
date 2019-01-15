const sslRedirect = require("heroku-ssl-redirect");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const compression = require("compression");
const session = require("express-session");
const passport = require("passport");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const db = require("./db").sequelize;
const sessionStore = new SequelizeStore({ db: db });
const PORT = process.env.PORT || 8000;
const app = express();
module.exports = app;

/**
 * In your development environment, you can keep all of your
 * app's secret API keys in a file called `secrets.js`, in your project
 * root. This file is included in the .gitignore - it will NOT be tracked
 * or show up on Github. On your production server, you can add these
 * keys as environment variables, so that they can still be read by the
 * Node process on process.env
 */
if (process.env.NODE_ENV !== "production") require("../secrets");

// passport registration
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) =>
  db.models.user
    .findOne({
      where: { id },
      include: [
        {
          model: db.models.role
        }
      ]
    })
    .then(user => done(null, user))
    .catch(done)
);

const createApp = () => {
  // logging middleware
  app.use(morgan("dev"));

  // body parsing middleware
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

  // compression middleware
  app.use(compression());

  // session middleware with passport
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "my best friend is Cody",
      store: sessionStore,
      resave: false,
      saveUninitialized: false
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(sslRedirect());

  // auth and api routes
  app.use("/auth", require("./auth"));
  app.use("/api", require("./api"));
  app.use("/admin", require("./admin"));

  // static file-serving middleware
  app.use(express.static(path.join(__dirname, "..", "public")));

  app.get("/:route/public/:file", (req, res, next) => {
    res.redirect(`/${req.params.file}`);
  });
  app.get("/public/:file", (req, res, next) => {
    res.redirect(`/${req.params.file}`);
  });
  app.get("/project/:symbol/document/public/:file", (req, res, next) => {
    res.redirect(`/${req.params.file}`);
  });
  app.get(
    "/project/:symbol/document/:documentId/public/:file",
    (req, res, next) => {
      res.redirect(`/${req.params.file}`);
    }
  );
  app.get(
    "/project/:symbol/document/:documentId/version/:versionId/question/:questionId/comment/public/:file",
    (req, res, next) => {
      res.redirect(`/${req.params.file}`);
    }
  );
  app.get(
    "/project/:symbol/document/:documentId/version/public/:file",
    (req, res, next) => {
      res.redirect(`/${req.params.file}`);
    }
  );
  app.get(
    "/project/:symbol/document/:documentId/version/:versionId/public/:file",
    (req, res, next) => {
      res.redirect(`/${req.params.file}`);
    }
  );
  app.get(
    "/project/:symbol/document/:documentId/version/:versionId/comment/public/:file",
    (req, res, next) => {
      res.redirect(`/${req.params.file}`);
    }
  );
  app.get("/documents/:documentId/public/:file", (req, res, next) => {
    res.redirect(`/${req.params.file}`);
  });
  app.get("/admin/version/public/:file", (req, res, next) => {
    res.redirect(`/${req.params.file}`);
  });
  app.get("/edit/:slug/step/public/:file", (req, res, next) => {
    res.redirect(`/${req.params.file}`);
  });
  app.get("/admin/list/public/:file", (req, res, next) => {
    res.redirect(`/${req.params.file}`);
  });
  app.get("/admin/list/versions/public/:file", (req, res, next) => {
    res.redirect(`/${req.params.file}`);
  });
  app.get("/user/:userId/public/:file", (req, res, next) => {
    res.redirect(`/${req.params.file}`);
  });

  // any remaining requests with an extension (.js, .css, etc.) send 404
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error("Not found");
      err.status = 404;
      next(err);
    } else {
      next();
    }
  });

  // sends index.html
  app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public/index.html"));
  });

  // error handling endware
  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || "Internal server error.");
  });
};

const startListening = () => {
  // start listening (and create a 'server' object representing our server)
  const server = app.listen(PORT, () =>
    console.log(`Mixing it up on port ${PORT}`)
  );
};

const syncDb = () => db.sync();

// This evaluates as true when this file is run directly from the command line,
// i.e. when we say 'node server/index.js' (or 'nodemon server/index.js', or 'nodemon server', etc)
// It will evaluate false when this module is required by another module - for example,
// if we wanted to require our app in a test spec
if (require.main === module) {
  sessionStore
    .sync()
    .then(syncDb)
    .then(createApp)
    .then(startListening);
} else {
  createApp();
}
