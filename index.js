const express = require("express");
const cors = require("cors");
const knexConfig = require("./knexfile");
const knex = require("knex");
const app = express();
app.use(cors());
app.use(express.json());
const port = 4000;

const db = knex(knexConfig.development);

app.get("/accounts", async (req, res) => {
  try {
    const accounts = await db("accounts").select("*");
    res.json(accounts);
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch account" });
  }
});

app.get("/transactions", async (req, res) => {
  try {
    const accounts = await db("transactions").select("*");
    res.json(accounts);
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

app.listen(port, () => {
  console.log("Server running at 4000");
});
