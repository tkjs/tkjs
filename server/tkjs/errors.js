class InternalError extends Error {
  constructor(message = "Internal error just happened") {
    super(message);
    this.name = "InternalError";
  }
}

module.exports = { InternalError };
