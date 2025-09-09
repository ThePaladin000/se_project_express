// Custom Error Constructors
const createCustomError = (name, statusCode, defaultMessage) => {
  const CustomError = function CustomError(message = defaultMessage) {
    Error.call(this);
    this.name = name;
    this.message = message;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, CustomError);
  };

  CustomError.prototype = Object.create(Error.prototype);
  CustomError.prototype.constructor = CustomError;

  return CustomError;
};

const BadRequestError = createCustomError(
  "BadRequestError",
  400,
  "Bad Request"
);
const UnauthorizedError = createCustomError(
  "UnauthorizedError",
  401,
  "Unauthorized"
);
const ForbiddenError = createCustomError("ForbiddenError", 403, "Forbidden");
const NotFoundError = createCustomError("NotFoundError", 404, "Not Found");
const ConflictError = createCustomError("ConflictError", 409, "Conflict");

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
