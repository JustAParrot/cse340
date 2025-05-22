const utilities = require("../utilities/");
const baseController = {};

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("layouts/layout", {
    title: "Home",
    nav,
    content: "../index" 
  });
};

module.exports = baseController;
