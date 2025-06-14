const { body, validationResult } = require("express-validator");

const messageRules = () => {
  return [
    body("subject")
      .trim()
      .notEmpty().withMessage("Subject is required.")
      .isLength({ max: 100 }).withMessage("Subject cannot exceed 100 characters."),
    body("body")
      .trim()
      .notEmpty().withMessage("Message body is required.")
      .isLength({ max: 1000 }).withMessage("Message cannot exceed 1000 characters.")
  ];
};

const checkMessageData = async (req, res, next) => {
  const errors = validationResult(req);
  const nav = await require("../utilities/").getNav();

  if (!errors.isEmpty()) {
    return res.status(400).render("account/message-form", {
      title: "Contact Support",
      nav,
      errors: errors.array()
    });
  }

  next();
};

module.exports = { messageRules, checkMessageData };
