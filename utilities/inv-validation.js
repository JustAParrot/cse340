const utilities = require("./index")
const { body, validationResult } = require("express-validator")
const validate = {}

// Add Classification Validation Rules
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Classification name is required.")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("No spaces or special characters allowed.")
  ]
}

// Check classification data
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await require(".").getNav()
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
      classification_name,
    })
    return
  }
  next()
}

// Inventory Rules
validate.inventoryRules = () => {
  return [
    body("classification_id").notEmpty().withMessage("Choose a classification."),
    body("inv_make").trim().notEmpty().withMessage("Vehicle make is required."),
    body("inv_model").trim().notEmpty().withMessage("Vehicle model is required."),
    body("inv_year").isInt({ min: 1900, max: 2100 }).withMessage("Year must be between 1900 and 2100"),
    body("inv_description").trim().notEmpty().withMessage("Description is required."),
    body("inv_image").trim().notEmpty().withMessage("Image path is required."),
    body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required."),
    body("inv_price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    body("inv_miles").isInt({ min: 0 }).withMessage("Miles must be a positive integer"),
    body("inv_color").trim().notEmpty().withMessage("Color is required.")
  ]
}

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList(req.body.classification_id)

  if (!errors.isEmpty()) {
    return res.render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      errors: errors.array(),
      ...req.body
    })
  }

  next()
}


module.exports = validate
