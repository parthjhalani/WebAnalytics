const cds = require('@sap/cds')
const express = require('express')
const session = require('express-session');
// const proxy = require("@sap/cds-odata-v2-adapter-proxy");
// const log = require("cf-nodejs-logging-support");
// const xsenv = require("@sap/xsenv");
// const cors = require('cors');

// const passport = require('passport')
// require('./server/passport')(passport);

const routes = require('./server/routes.js')


cds.once('bootstrap', async (app) => {

  // console.log("process.env.NODE_ENV: " + process.env.NODE_ENV)
  // console.log("cds.env.env: " + cds.env.env)
  // if (process.env.NODE_ENV !== "production") {
  //   console.warn("Using CORS in development");
  //   app.use(cors());
  // } else {
  //   console.log("CORS disabled in production");
  // }

  // app.use(require("express-session")({ 
  //   secret: "authenticate_user", 
  //   resave: true, 
  //   saveUninitialized: true
  // }));

  // app.use(passport.initialize()); 
  // app.use(passport.session());  

  // app = loginRoute.loginAPI(app, passport);
  // app = lcSectionPage.getLcSections(app, passport)
  app.use(express.json());
  // app.use(cookieParser());
  app.use(session({secret: "NA Innovation Advisory"}));

  app = routes.API(app);

  // app = lcSectionPage.getLcSections(app)
  // app = pageRoute.pageAPI(app);


});

module.exports = cds.server