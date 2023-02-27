"use strict";
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

// Session
const session = require("express-session");
const redis = require("redis");
const RedisStore = require("connect-redis")(session);
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
  legacyMode: true,
});

// Passport
const passport = require("passport");

// ** conditional ** Passport MongoDB
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");

// Routes
const indexRouter = require("./routes/api/v1/index");
const handle_boom_errors = require("./middlewares/handle_boom_errors");
const handle_http_errors = require("./middlewares/handle_http_errors");

// Connect REDIS
redisClient.connect().catch((err) => {
  console.error(err);
  process.exit(1);
});
const app = express();

// MIDDLEWARES
app.use(cors());
app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// SESSION WITH REDIS
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: new RedisStore({ client: redisClient }),
    resave: true,
    saveUninitialized: true,
  })
);

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

require("./helpers/passport"); // Passport relational DB

// ROUTES
app.use("/api/v1/", indexRouter);
app.use(handle_http_errors);
app.use(handle_boom_errors);

module.exports = app;
