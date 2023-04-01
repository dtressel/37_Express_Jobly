const db = require("../db");
const { NotFoundError } = require("../expressError");

/** Creates a custom error message for an error occuring from
 * a wrong username or job id while creating an application.
 * 
 * This function is sufficiently tested in user.test.js
 * 
 */

async function customizeApplyError(username, jobId, err) {
  const messages = [];
  // Check if username was correct and if not create message
  const userRes = await db.query(
      `SELECT username
        FROM users
        WHERE username = $1`,
    [username]
  );
  if (!userRes.rows[0]) {
    messages.push(`username (${username})`);
  }
  // Check if jobId was correct and if not create message
  const jobRes = await db.query(
    `SELECT id
      FROM jobs
      WHERE id = $1`,
  [jobId]
  );
  if (!jobRes.rows[0]) {
    messages.push(`job id (${jobId})`);
  }
  // if custom messages were created return custom error
  if (messages[0]) {
    return new NotFoundError(`${messages.join(' and ')} not found`);
  }
  // else if no custom messages return original error
  return err;
}

module.exports = { customizeApplyError };