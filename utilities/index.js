const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  const data = await invModel.getClassifications();

  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';

  const seen = new Set();

  data.rows.forEach((row) => {
    const name = row.classification_name;
    const id = row.classification_id;
    if (!seen.has(name)) {
      seen.add(name);
      list += `<li><a href="/inv/type/${id}" title="See our inventory of ${name} vehicles">${name}</a></li>`;
    }
  });

  list += "</ul>";
  return list;
};

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* **************************************
* Build the classification view HTML :(
* ************************************ */
Util.buildClassificationGrid = async function (data, loggedin = false) {
  let grid = "";

  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += `<li>
        <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
          <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">
        </a>
        <div class="namePrice">
          <h2>
            <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>
        </div>`;

      if (loggedin) {
        grid += `<div class="delete-button">
          <a href="/inv/delete/${vehicle.inv_id}" class="button warning">Delete</a>
        </div>`;
      }

      grid += `</li>`;
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  return grid;
};



// Vehicle Detail HTML
Util.buildVehicleDetailHtml = function(vehicle) {
  const price = Number(vehicle.inv_price).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const miles = Number(vehicle.inv_miles).toLocaleString();

  return `
<section class="vehicle-detail">
  <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
  <div class="vehicle-info">
    <h2>${vehicle.inv_make} ${vehicle.inv_model} (${vehicle.inv_year})</h2>
    <p><strong>Price:</strong> ${price}</p>
    <p><strong>Mileage:</strong> ${miles} miles</p>
    <p><strong>Color:</strong> ${vehicle.inv_color}</p>
    <p><strong>Description:</strong> ${vehicle.inv_description}</p>
  </div>
</section>`;
};

// Inventory function
async function buildClassificationList(classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList = ""

  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += " selected"
    }
    classificationList += `>${row.classification_name}</option>`
  })

  return classificationList
}


/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    return next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

// Inventory List for Delete
Util.buildInventoryList = function (data) {
  let table = `<table class="invTable">
    <thead>
      <tr><th>Vehicle</th><th>Year</th></tr>
    </thead>
    <tbody>`

  data.forEach(vehicle => {
    table += `<tr>
      <td>${vehicle.inv_make} ${vehicle.inv_model}</td>
      <td>${vehicle.inv_year}</td>
    </tr>`
  })

  table += `</tbody></table>`
  return table
}

// Restrict inventory to employee or admin 
Util.checkAccountType = (req, res, next) => {
  const type = res.locals.account_type
  if (type === "Employee" || type === "Admin") {
    return next()
  } else {
    req.flash("notice", "You do not have permission to access this area.")
    return res.redirect("/account/login")
  }
}



Util.buildClassificationList = buildClassificationList
module.exports = Util
