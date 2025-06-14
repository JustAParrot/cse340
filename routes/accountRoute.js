const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")
const messageValidate = require("../utilities/message-validation");
console.log("DEBUG: typeof accountController.buildUpdateForm =", typeof accountController.buildUpdateForm);


// After Login Routes
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

// Login Routes
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Register Routes
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Logout
router.get("/logout", utilities.handleErrors(accountController.logout))

// Update Account View
 router.get("/update/:accountId", 
   utilities.checkLogin, 
   utilities.handleErrors(accountController.buildUpdateForm))

// Account Info Update
router.post("/update", 
  regValidate.updateRules(), 
  regValidate.checkUpdateData, 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.updateAccountInfo))


// Password Change
router.post("/update-password",
  regValidate.passwordRule(),
  regValidate.checkPasswordData,
  utilities.checkLogin,
  utilities.handleErrors(accountController.updatePassword))

// Feedback - Message 
router.get("/contact", 
  utilities.checkLogin, 
  messageController.buildMessageForm);
const messageValidate = require("../utilities/message-validation");
router.post(
  "/contact",
  utilities.checkLogin,
  messageValidate.messageRules(),
  messageValidate.checkMessageData,
  messageController.handleMessagePost
);

// Feedback View
router.get(
  "/inbox",
  utilities.checkLogin,
  utilities.checkAdmin,
  messageController.viewMessages
);


module.exports = router
