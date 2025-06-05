const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

// Classification view
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const nav = await utilities.getNav();

  if (!data || data.length === 0) {
    req.flash("notice", "No vehicles found for this classification.");
    return res.status(404).render("inventory/classification", {
      title: "No Vehicles Found",
      nav,
      grid: "<p>No inventory available.</p>"
    });
  }

  const className = data[0].classification_name;
  const grid = await utilities.buildClassificationGrid(data, res.locals.loggedin); 

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

// Error Test
invCont.testError = async function (req, res, next) {
  throw new Error("Excellent work. You managed to fail spectacularly! Simulated Error 500");
};

// Management view
async function buildManagement(req, res, next) {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList(); 
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationList, 
    errors: null,
    messages: req.flash("notice")
  });
}





// Display Add Classification Form
invCont.buildAddClassification = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  });
};

// Process Classification Form
async function addClassification(req, res) {
  const { classification_name } = req.body;
  const result = await invModel.addClassification(classification_name);
  const nav = await utilities.getNav();

  if (result) {
    req.flash("notice", `The classification "${classification_name}" was successfully added.`);
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav
    });
  } else {
    req.flash("notice", "Sorry, the classification addition failed.");
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav
    });
  }
}

// Display Add Inventory Form
invCont.buildAddInventory = async function (req, res) {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationList,
    errors: null
  });
};

// Process Add Inventory Form
async function addInventory(req, res) {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body;

  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList(classification_id);

  const result = await invModel.addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  );

  if (result) {
    req.flash("notice", `${inv_make} ${inv_model} added successfully.`);
    res.redirect("/inv");
  } else {
    req.flash("notice", "Sorry, adding the inventory item failed.");
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      errors: null,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    });
  }
}

// Deliver Delete Confirmation View
invCont.buildDeleteView = async function (req, res, next) {
  const invId = req.params.invId
  const data = await invModel.getInventoryById(invId)
  const nav = await utilities.getNav()
  res.render("inventory/delete-confirm", {
    title: `Delete ${data.inv_make} ${data.inv_model}`,
    nav,
    errors: null,
    item: data,
  })
}

// Process Deletion
invCont.deleteInventoryItem = async function (req, res, next) {
  const invId = req.body.inv_id
  const result = await invModel.deleteInventoryItem(invId)
  const nav = await utilities.getNav()

  if (result) {
    req.flash("notice", "The item was successfully deleted.")
    res.redirect("/inv")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.status(500).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    })
  }
}


invCont.buildManagement = buildManagement
invCont.addClassification = addClassification
invCont.addInventory = addInventory

module.exports = invCont

