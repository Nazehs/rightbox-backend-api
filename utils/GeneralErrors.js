"use strict";

class GeneralError extends Error {
  get name() {
    return this.constructor.name;
  }
}

class BadRequest extends GeneralError {
  constructor(message, options = {}) {
    super(message);

    for (const [key, value] of Object.entries(options)) {
      this[key] = value;
    }
  }
  get statusCode() {
    return 401;
  }
}
class NotFound extends GeneralError {
  constructor(message, options = {}) {
    super(message);

    for (const [key, value] of Object.entries(options)) {
      this[key] = value;
    }
  }
  get statusCode() {
    return 404;
  }
}

module.exports = {
  GeneralError,
  BadRequest,
  NotFound,
};
