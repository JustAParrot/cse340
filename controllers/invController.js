const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

// Classification view
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  const nav = await utilities.getNav();
  const className = data[0].classification_name;

  res.render("inventory/classification", {
    title: `${className} vehicles`,
    nav,
    grid
  });
};


// Detail view
invCont.buildDetailView = async function (req, res, next) {
  const invId = req.params.invId;
  const vehicleData = await invModel.getInventoryById(invId);

  if (!vehicleData) {
    return res.status(404).send("Vehicle not found");
  }

  const nav = await utilities.getNav();
  const vehicleHtml = utilities.buildVehicleDetailHtml(vehicleData);

  res.render("inventory/detail", {
    title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
    nav,
    vehicleHtml
  });
};

// Error Link W03 Task 3
invCont.testError = async function (req, res, next) {
  throw new Error("Excellent work. You managed to fail spectacularly! Simulated Error 500");
};

// Managment 
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  })
}

// Display Add Classification Form 
invCont.buildAddClassification = async function (req, res) {
  const nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  })
}

// Process Classification Form 
invCont.addClassification = async function (req, res) {
  const nav = await utilities.getNav()
  const { classification_name } = req.body

  try {
    const result = await invModel.addClassification(classification_name)
    if (result) {
      req.flash("notice", `Successfully added ${classification_name} classification.`)
      return res.redirect("/inv")
    }
  } catch (error) {
    req.flash("notice", "Classification creation failed.")
    return res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: [{ msg: error.message }],
      classification_name
    })
  }
}


module.exports = invCont;
