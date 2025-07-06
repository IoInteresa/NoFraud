class ThrowError extends Error {
  constructor(statusCode, data) {
    super(data);

    this.statusCode = statusCode;
    this.data = data;
  }
}

module.exports = ThrowError;
