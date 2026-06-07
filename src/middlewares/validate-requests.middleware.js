const validateRequestsMiddleware = (schemas) => {
  return (req, res, next) => {
    const errors = {};

    // 1. Validate URL Path parameters (req.params)
    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        errors.params = result.error.flatten().fieldErrors;
      } else {
        req.params = result.data; // Overwrite with sanitized data
      }
    }

    // 2. Validate Request Body (req.body)
    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        errors.body = result.error.flatten().fieldErrors;
      } else {
        req.body = result.data; // Overwrite with sanitized data
      }
    }

    // 3. Validate Query Parameters (req.query)
    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        errors.query = result.error.flatten().fieldErrors;
      } else {
        req.query = result.data; // Overwrite with sanitized data
      }
    }

    // If any validation group failed, block the request and return errors
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors,
      });
    }

    // Success! Move to the next middleware or controller handler
    next();
  };
};

export {
  validateRequestsMiddleware
}