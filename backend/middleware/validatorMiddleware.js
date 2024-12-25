import { validationResult } from "express-validator";


const validatorMiddleware = (req, res, next) => {
  // to catch errors from rules that i made
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()});
  }
  next();
};

export default validatorMiddleware;