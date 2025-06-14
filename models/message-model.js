const db = require("../database/")

async function createMessage(account_id, subject, body) {
  return db.query(`
    INSERT INTO messages (account_id, subject, body)
    VALUES ($1, $2, $3)
  `, [account_id, subject, body]);
}

async function getMessagesByAccount(account_id) {
  return db.query(`
    SELECT * FROM messages WHERE account_id = $1 ORDER BY created_at DESC
  `, [account_id]);
}

async function getAllMessages() {
  return db.query(`
    SELECT m.*, a.account_firstname, a.account_lastname
    FROM messages m
    JOIN account a ON m.account_id = a.account_id
    ORDER BY m.created_at DESC
  `);
}


module.exports = { createMessage, getMessagesByAccount, getAllMessages}