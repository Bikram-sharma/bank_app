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

app.post("/addtransaction", async (req, res) => {
  const { amount, from_account_id, to_account_id } = req.body;
  try {
    await db("transactions").insert({ amount, from_account_id, to_account_id });
    res.json({ message: "transaction updated successfully" });
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: "Failed to insert transaction" });
  }
});

app.listen(port, () => {
  console.log("Server running at 4000");
});
