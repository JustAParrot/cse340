const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  const nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


// Detail View
invCont.buildDetailView = async function (req, res, next) {
  const invId = req.params.invId
  const vehicleData = await invModel.getInventoryById(invId)

  if (!vehicleData) {
    return res.status(404).send("Vehicle not found")
  }

  const nav = await utilities.getNav()
  const vehicleHtml = utilities.buildVehicleDetailHtml(vehicleData)

  res.render("inventory/detail", {
    title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
    nav,
    vehicleHtml,
  })
}


module.exports = invCont