require("dotenv").config();

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      user: process.env.USER_NAME,
      password: process.env.USER_PASSWORD,
      database: "bank_app",
    },
  },
};
