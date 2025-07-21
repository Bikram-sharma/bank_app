const express = require("express");
const cors = require("cors");
const knexConfig = require("./knexfile");
const knex = require("knex");
const app = express();
app.use(cors());
app.use(express.json());
const port = 4000;

const db = knex(knexConfig.development);

// send accounts

app.get("/accounts", async (req, res) => {
  try {
    const accounts = await db("accounts").select("*").orderBy("id", "asc");
    res.json(accounts);
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch account" });
  }
});

// send transactions

app.get("/transactions", async (req, res) => {
  try {
    const accounts = await db("transactions").select("*");
    res.json(accounts);
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

//  create transactions

app.post("/createtransaction", async (req, res) => {
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
        .decrement("balance", numericAmount);

      await trx("accounts")
        .where("id", to_account_id)
        .increment("balance", numericAmount);
    });
    res.json({ message: "transaction updated successfully" });
  } catch (error) {
    console.error("Transaction error:", error.message);
    if (
      error.message === "Sender account not found" ||
      error.message === "Receiver account not found" ||
      error.message === "Insufficient balance"
    ) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

// create Account

app.post("/createaccount", async (req, res) => {
  const { balance, number, pin_code } = req.body;

  if (balance == null || !number || !pin_code) {
    res.status(400).json({ message: "All field are required" });
    return;
  }
  try {
    await db("accounts").insert({ balance, number, pin_code });
    res.status(201).json({ message: "Account Created Successfully" });
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

//delete Account

app.delete("/:number", async (req, res) => {
  const number = req.params.number;

  if (number.length != 9) {
    return res.status(400).json({ message: "Invalid Account Number!" });
  }
  try {
    const account = await db("accounts").where("number", number).first();

    if (!account) {
      return res
        .status(404)
        .json({ message: `Account Number #${number} not found!` });
    }

    const {balance} = await db ("accounts").select("balance").where ("number",number).first();
      if(balance > 0){
        return res.status(400).json({message: "Clear your balance before deleting"});
      }

    await db("accounts").where("number", number).del();
    return res
      .status(200)
      .json({ message: `Account #${number} deleted successfully.` });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// deposit

app.post("/deposit", async (req, res) => {
  const { number, amount } = req.body;

  if (!number || !amount) {
    return res
      .status(400)
      .json({ message: "Account Number and amount are needed!" });
  }
  try {
    await db("accounts").where("number", number).increment("balance", amount);
    res.status(200).json({ message: "deposit successful" });
  } catch (error) {
    console.error("Error depositing:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// withdraw

app.post("/withdraw", async (req, res) => {
  const { number, amount } = req.body;

  if (!number || !amount) {
    return res
      .status(400)
      .json({ message: "Account Number and amount are needed!" });
  }
  try {
    const account = await db("accounts")
      .select("*")
      .where("number", number)
      .first();
    if (account.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    await db("accounts").where("number", number).decrement("balance", amount);
    res.status(200).json({ message: "withdraw successful" });
  } catch (error) {
    console.error("Error withdrawing:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.listen(port, () => {
  console.log("Server running at 4000");
});
