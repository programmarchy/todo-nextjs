class NotFoundError extends Error {
  constructor(message = 'Resource not found.') {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, NotFoundError);
  }
}

export default NotFoundError;
