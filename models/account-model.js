const db = require("../database");

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = `
      INSERT INTO account 
        (account_firstname, account_lastname, account_email, account_password, account_type) 
      VALUES 
        ($1, $2, $3, $4, 'Client') 
      RETURNING *`
    return await db.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password
    ])
  } catch (error) {
  console.error("Error executing registerAccount:", error); // <-- Add this
  throw error; // Let it propagate to your controller or error middleware
  }

}

module.exports = { registerAccount }
