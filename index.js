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
  const numericAmount = Number(amount);
  try {
    await db.transaction(async (trx) => {
      const from = await trx("accounts")
        .select("*")
        .where("id", from_account_id)
        .first();

      if (!from) {
        throw new Error("Sender account not found");
      }

      if (Number(from.balance) < numericAmount) {
        throw new Error("Insufficient balance");
      }

      const to = await trx("accounts")
        .select("*")
        .where("id", to_account_id)
        .first();

      if (!to) {
        throw new Error("Receiver account not found");
      }
      await trx("transactions").insert({
        amount: numericAmount,
        from_account_id,
        to_account_id,
      });

      await trx("accounts")
        .where("id", from_account_id)
        .update({ balance: Number(from.balance) - numericAmount });

      await trx("accounts")
        .where("id", to_account_id)
        .update({ balance: Number(to.balance) + numericAmount });
    });
    res.json({ message: "transaction updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: error.message || "Failed to insert transaction" });
  }
});

app.listen(port, () => {
  console.log("Server running at 4000");
});
