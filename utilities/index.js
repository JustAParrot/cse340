const invModel = require("../models/inventory-model")
const Util = {}

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



/* **************************************
* Build the classification view HTML :(
* ************************************ */
Util.buildClassificationGrid = async function (data) {
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
        </div>
      </li>`;
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


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util