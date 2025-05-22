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

  res.render("layouts/layout", {
    title: `${className} vehicles`,
    nav,
    content: "../inventory/classification", 
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

  res.render("layouts/layout", {
    title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
    nav,
    content: "../inventory/detail",
    vehicleHtml
  });
};

module.exports = invCont;
