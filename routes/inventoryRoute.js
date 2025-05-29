// Needed Resources 
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
router.get("/", utilities.handleErrors(inventoryController.buildManagement))

// Classification Route
router.get("/add-classification", invController.buildAddClassification)

// Handle Classification Submission
router.post("/add-classification",
  invValidate.classificationRules(), 
  invValidate.checkClassificationData,
  invController.addClassification
)





module.exports = router;