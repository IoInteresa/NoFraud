const db = require("../Database/connection");
const { formatDate } = require("../Helpers");
const { DAY_IN_MS } = require("../Constants");

const getTodayVerificationCount = async ({ phoneNumber, productId }) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const todayVerificationCount = await db("verifications")
    .where({ phoneNumber, productId })
    .where("createdAt", ">=", formatDate(startOfDay))
    .count({ count: "*" })
    .first();

  return parseInt(todayVerificationCount.count, 10);
};

const getLastDayVerifications = () =>
  db("verifications").where(
    "createdAt",
    ">=",
    formatDate(new Date() - DAY_IN_MS)
  );

const getAllVerifications = () => db("verifications").select("*");

const createVerification = async ({ phoneNumber, code, productId }) =>
  db("verifications").insert({ phoneNumber, code, productId });

const getVerification = async ({ phoneNumber, productId }) =>
  db("verifications")
    .where({ phoneNumber, productId, isVerified: false })
    .orderBy("createdAt", "desc")
    .first();

const updateVerification = async ({ id }) =>
  db("verifications")
    .where({ id })
    .update({ isVerified: true, updatedAt: formatDate(new Date()) });

module.exports = {
  getTodayVerificationCount,
  createVerification,
  getVerification,
  updateVerification,
  getLastDayVerifications,
  getAllVerifications,
};
