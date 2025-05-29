const regValidate = require('../utilities/account-validation')
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")

// Login route
router.get("/", utilities.handleErrors(accountController.buildLogin))
router.post("/login", utilities.handleErrors(accountController.accountLogin))

// Register route
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)



module.exports = router
