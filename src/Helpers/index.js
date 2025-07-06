const formatDate = (d) => d.toISOString().slice(0, 19).replace("T", " ");

const getDateUTC5 = () => {
  const date = new Date();
  date.setUTCHours(date.getUTCHours() + 5);
  return date.toISOString().slice(0, 19).replace("T", " ");
};

module.exports = { formatDate, getDateUTC5 };
