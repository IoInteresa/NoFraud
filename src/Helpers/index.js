const formatDate = (d) => d.toISOString().slice(0, 19).replace("T", " ");

module.exports = { formatDate };
