const db = require('./database/db')

const handler = async (event) => {
  try {
    await db.connect();
    const res = await db.query("SELECT current_database()");
    await db.end();
    return {
      statusCode: 200,
      body: JSON.stringify({ database: res.rows[0].current_database }),
    };
  } catch (err) {
    console.error("Error while connecting to db:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Database query failed" }),
    };
  }
};

module.exports = {
  handler,
};
