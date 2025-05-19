const express = require("express");
const { handler } = require(".");
const createTables = require("./database/initDB");

const app = express();

app.use(express.json());

createTables()

app.all("/database", async (req, res) => {
  const event = {
    httpMethod: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body ? JSON.stringify(req.body) : null,
  };
  try {
    const response = await handler(event);
    console.log(response);
    res.status(response.statusCode).send(response.body);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});
