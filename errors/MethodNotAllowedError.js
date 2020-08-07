class MethodNotAllowedError extends Error {
  constructor(method, allowMethods = ['GET']) {
    const message = `Method ${method} not allowed.`;
    super(message);
    this.name = this.constructor.name;
    this.method = method;
    this.allowMethods = allowMethods;
    Error.captureStackTrace(this, MethodNotAllowedError);
  }
}

export default MethodNotAllowedError;
