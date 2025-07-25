/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities")
const session = require("express-session")
const pool = require('./database/')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

// Chatgpt code to help with an Error at: "/": Cannot read properties of undefined (reading 'account_id')
app.use(cookieParser())

app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Safe to set res.locals
app.use((req, res, next) => {
  res.locals.account_id = req.session.account_id
  res.locals.account_type = req.session.account_type
  res.locals.account_name = req.session.account_name
  res.locals.loggedin = req.session.account_id ? true : false
  next()
})



/* ***********************
 * Middleware
 * ************************/
// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(utilities.checkJWTToken)


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root



/* ***********************
 * Routes
 *************************/
app.use(express.static('public'));
//Index Routes
//Static Route     =     app.get("/", function(req, res) {res.render("index", {tittle: "Home"})})
app.get("/", utilities.handleErrors(baseController.buildHome))
// Inventory routes
app.use("/inv", inventoryRoute)
// Account route
const accountRoute = require("./routes/accountRoute")
app.use("/account", accountRoute)
// File Not Found Route - must be last in list
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Team gap FF15.' })
})



/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = "";
  try {
    nav = await utilities.getNav();
  } catch (navErr) {
    console.error("Navigation generation failed:", navErr.message);
  }

  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  const message = "GG - Jungle Gap - FF15";

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav
  });
});



/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST



/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
