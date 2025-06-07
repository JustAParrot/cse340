// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inv-validation")
const utilities = require("../utilities")

// --- Public Routes ---
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to view inventory item details
router.get("/detail/:invId", invController.buildDetailView)

// Route for classification dropdown redirect
router.get("/by-classification", (req, res) => {
  const classificationId = req.query.classificationId
  res.redirect(`/inv/type/${classificationId}`)
})

// --- Admin-Protected Routes ---
// Inventory Management Dashboard
router.get("/", 
  utilities.checkLogin, 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildManagement)
)

// Add Classification Form
router.get("/add-classification", 
  utilities.checkLogin, 
  utilities.checkAccountType, 
  invController.buildAddClassification
)

// Handle Classification Submission
router.post("/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.checkLogin,
  utilities.checkAccountType,
  invController.addClassification
)

// Add Inventory Form
router.get("/add-inventory", 
  utilities.checkLogin, 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildAddInventory)
)

// Handle Add Inventory Submission
router.post("/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.addInventory)
)

// Delete Inventory Item - Confirm View
router.get("/delete/:invId", 
  utilities.checkLogin, 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildDeleteView)
)

// Handle Delete Inventory Submission
router.post("/delete", 
  utilities.checkLogin, 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.deleteInventoryItem)
)

// Error test route
router.get("/error-test", utilities.handleErrors(invController.testError))

module.exports = router
