const db = require("../Database/connection");

const addLog = (log) => db("logs").insert(log);

module.exports = {
  addLog,
};
