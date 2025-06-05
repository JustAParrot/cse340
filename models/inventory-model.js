const pool = require("../database/")

// Get classification data

async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}


// Get all inventory items and classification_name by classification_id
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}


// Get Inventory by ID
async function getInventoryById(invId) {
  try {
    const data = await pool.query(
      'SELECT * FROM public.inventory WHERE inv_id = $1',
      [invId]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryById error " + error)
  }
}

async function addClassification(classification_name) {
  try {
    const check = await pool.query(
      "SELECT * FROM classification WHERE classification_name = $1",
      [classification_name]
    );

    if (check.rowCount > 0) {
      return null; 
    }

    const sql = `INSERT INTO classification (classification_name) VALUES ($1)`;
    const result = await pool.query(sql, [classification_name]);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}


// Add to inventory
async function addInventory(
  classification_id, inv_make, inv_model, inv_year,
  inv_description, inv_image, inv_thumbnail,
  inv_price, inv_miles, inv_color
) {
  try {
    const sql = `
      INSERT INTO inventory (
        classification_id, inv_make, inv_model, inv_year,
        inv_description, inv_image, inv_thumbnail,
        inv_price, inv_miles, inv_color
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *`
    return await pool.query(sql, [
      classification_id, inv_make, inv_model, inv_year,
      inv_description, inv_image, inv_thumbnail,
      inv_price, inv_miles, inv_color
    ])
  } catch (error) {
    return error.message
  }
}

// DELETE 
async function deleteInventoryItem(inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1"
    const result = await pool.query(sql, [inv_id])
    return result.rowCount > 0
  } catch (error) {
    console.error("Delete error:", error)
    return false
  }
}




module.exports = {getClassifications, getInventoryByClassificationId, getInventoryById, addClassification, addInventory, deleteInventoryItem};
