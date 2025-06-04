const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

// Deliver login view
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

// Deliver registration view
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Registration",
    nav,
    errors: null
  })
}

// Process Registration
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  let hashedPassword

  try {
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the registration.")
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      errors: [] 
    })
  }

  // Debug
  console.log("REGISTER CONTROLLER HIT:", req.body)

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    return res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: [] 
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    return res.status(501).render("account/register", {
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      errors: [] 
    })
  }
}

// Login
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Invalid email or password.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      account_email,
      errors: []
    })
  }

  try {
    const match = await bcrypt.compare(account_password, accountData.account_password)
    if (!match) {
      req.flash("notice", "Invalid email or password.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        account_email
      })
    }

    req.session.account_id = accountData.account_id
    req.session.account_type = accountData.account_type
    req.session.account_name = `${accountData.account_firstname} ${accountData.account_lastname}`

    // Remove password before sending into token
    delete accountData.account_password

    const accessToken = jwt.sign(
      accountData,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    )

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000 // 1 hour? Just to test
    })

    req.flash("notice", `Welcome back, ${accountData.account_firstname}`)
    return res.redirect("/account/")
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).send("An unexpected error occurred.")
  }
}

async function buildAccountManagement(req, res) {
  const nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    messages: req.flash("notice"),
    errors: null,
  })
}

// Logout
async function logout(req, res) {
  req.session.destroy(() => {
    res.clearCookie("jwt")
    res.redirect("/account/login")
  })
}



module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, logout}

