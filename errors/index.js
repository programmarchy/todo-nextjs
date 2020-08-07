import { ValidationError } from 'yup';
import NotFoundError from './NotFoundError';
import MethodNotAllowedError from './MethodNotAllowedError';

export const handleError = (res, err) => {
  if (err instanceof ValidationError) {
    const { name, message, path, errors, inner } = err;
    res.status(400).json({
      error: { name, message, path, errors, inner }
    });
  } else if (err instanceof NotFoundError) {
    const { name, message } = err;
    res.status(404).json({
      error: { name, message }
    });
  } else if (err instanceof MethodNotAllowedError) {
    const { name, message, allowMethods } = err;
    res.setHeader('Allow', allowMethods);
    res.status(405).json({
      error: { name, message }
    });
  } else {
    const { name, message } = err;
    res.status(500).json({
      error: { name, message }
    });
  }
};

export const handleMethodNotAllowedError = (res, method, allowMethods) => {
  handleError(res, new MethodNotAllowedError(method, allowMethods));
};
