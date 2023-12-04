require("dotenv").config();

module.exports = {
  development: {
    username: process.env.SEQUELIZE_USER,
    password: `${process.env.POSTGRES_PASSWORD}`,
    database: process.env.DATABASE,
    host: process.env.HOST,
    dialect: "postgres",
  },
  test: {
    username: process.env.SEQUELIZE_USER,
    password: `${process.env.POSTGRES_PASSWORD}`,
    database: process.env.DATABASE_TEST,
    host: process.env.HOST,
    dialect: "postgres",
  },
};
