const db = require("../Database/connection");

const getProduct = (id) => db("products").select("*").where("id", id).first();

const getAllProducts = () => db("products").select("*");

const setProductActivation = (id, isActive) =>
  db("products").where("id", id).update({ isActive });

module.exports = {
  getProduct,
  getAllProducts,
  setProductActivation,
};
