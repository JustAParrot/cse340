const db = require("../database");
const pool = require("../database/");

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = `
      INSERT INTO account 
        (account_firstname, account_lastname, account_email, account_password, account_type) 
      VALUES 
        ($1, $2, $3, $4, 'client') 
      RETURNING *`
    return await db.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password
    ])
  } catch (error) {
    return error.message
  }
}

async function getAccountByEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const result = await pool.query(sql, [account_email])
    return result.rows[0]  
  } catch (error) {
    console.error("getAccountByEmail error:", error)
    return null
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount > 0 
  } catch (error) {
    console.error("checkExistingEmail error:", error)
    return false
  }
}

//Get account by iD
async function getAccountById(account_id) {
  const result = await db.query("SELECT * FROM account WHERE account_id = $1", [account_id])
  return result.rows[0] || null
}

// Updates
async function updateAccount(account_id, firstname, lastname, email) {
  return db.query(`
    UPDATE account
    SET account_firstname = $1, account_lastname = $2, account_email = $3
    WHERE account_id = $4
  `, [firstname, lastname, email, account_id])
}

// Password Update
async function updatePassword(account_id, hashedPassword) {
  return db.query(`
    UPDATE account
    SET account_password = $1
    WHERE account_id = $2
  `, [hashedPassword, account_id])
}


module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword
}


