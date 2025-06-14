const messageModel = require("../models/message-model");
const utilities = require("../utilities");

async function buildMessageForm(req, res) {
  const nav = await utilities.getNav()
  res.render("account/message-form", {
    title: "Send a Message",
    nav,
    messages: req.flash("notice") || [] 
  })
}

async function handleMessagePost(req, res) {
  const { subject, body } = req.body;
  const account_id = res.locals.accountData.account_id;
  try {
    await messageModel.createMessage(account_id, subject, body);
    req.flash("notice", "Message sent!");
    res.redirect("/account");
  } catch (err) {
    req.flash("notice", "Error sending message.");
    res.redirect("/account/contact");
  }
}

async function viewMessages(req, res) {
  const nav = await utilities.getNav();
  const messages = await messageModel.getAllMessages(); 
  res.render("account/inbox", {
    title: "User Messages",
    nav,
    messages
  });
}


module.exports = { buildMessageForm, handleMessagePost, viewMessages}