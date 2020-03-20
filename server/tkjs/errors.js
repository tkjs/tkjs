class InternalError extends Error {
  constructor(message = "Internal error just happened") {
    super(message);
    this.name = "InternalError";
  }
}

class SessionNotFoundError extends Error {
  constructor(message = "Session not found, you need to update session first") {
    super(message);
    this.name = "SessionNotFoundError";
  }
}

class BadRequestError extends Error {
  constructor(message = "Bad request, it seems you forget something") {
    super(message);
    this.name = "BadRequestError";
  }
}

class ExtractorNotFoundError extends Error {
  constructor(message = "It seems what you looking for is not found") {
    super(message);
    this.name = "ExtractorNotFound";
  }
}

module.exports = {
  InternalError,
  BadRequestError,
  SessionNotFoundError,
  ExtractorNotFoundError
};
