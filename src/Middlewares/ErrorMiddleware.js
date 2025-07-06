const { HttpStatus } = require("../Constants");
const { ThrowError } = require("../Handlers");

// Has unused params - ok
const ErrorMiddleware = (error, req, res, _) => {
  // For logging
  console.error(error);

  return res
    .status(
      error instanceof ThrowError
        ? error.statusCode
        : HttpStatus.INTERNAL_SERVER_ERROR
    )
    .json();
};

module.exports = ErrorMiddleware;
