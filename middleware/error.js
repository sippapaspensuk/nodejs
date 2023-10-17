module.exports = (err, req, res, next) => {
  console.log(err);
  if (err.message === "unauthenticated") {
    err.message = err.message + " token error";
    err.statusCode = 401;
  }
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    err.message = err.errors[0].message;

    err.statusCode = 400;
  }
  if (err.name === "TokenExpieredError" || err.name === "JsonWebTokenError") {
    err.statusCode = 401;
  }

  res.status(err.statusCode || 500).json({ message: err.message });
};
