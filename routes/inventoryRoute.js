// Needed Resources 
const invValidate = require("../utilities/inv-validation")
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Detail Route 
router.get('/detail/:invId', invController.buildDetailView);

// Error Route 
router.get("/error-test", utilities.handleErrors(invController.testError));

// Managment Route
router.get("/", utilities.handleErrors(invController.buildManagement))

// Classification Route
router.get("/add-classification", invController.buildAddClassification)

// Handle Classification Submission
router.post("/add-classification",
  invValidate.classificationRules(), 
  invValidate.checkClassificationData,
  invController.addClassification
)

// Inventory Route
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// Handle form submission
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// DELETE Route
router.get("/delete/:invId", utilities.checkLogin, utilities.handleErrors(invController.buildDeleteView))
router.post("/delete/", utilities.checkLogin, utilities.handleErrors(invController.deleteInventoryItem))


// Route to handle dropdown "View Inventory By Classification"
router.get("/by-classification", (req, res) => {const classificationId = req.query.classificationId; res.redirect(`/inv/type/${classificationId}`);});




module.exports = router;