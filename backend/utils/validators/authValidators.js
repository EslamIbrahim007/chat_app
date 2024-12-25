import {check} from "express-validator";
import userModel from "../../models/userModel.js";

import validatorMiddleware from '../../middleware/validatorMiddleware.js';

export const signValidator = [
  check('fullName')
    .notEmpty().withMessage('Your name is required ')
    .isLength({ min: 3 }).withMessage('must be at least 3 characters')
    .isLength({ max: 25 }).withMessage('this is to long'),
  check('email')
    .notEmpty().withMessage('email is required')
    .isEmail().withMessage('enter an in valid email')
    .custom((val) => userModel.findOne({ email: val }).then((user) => {
    if (user) {
      return Promise.reject(new Error('email already exists'));
    }
    })),
  check("password")
    .notEmpty().withMessage('your password is required')
    .isLength({ min: 8 }).withMessage('must be at least 8 characters'),
   /* .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error('Password does not match');
      }
      return true
    }),*/
  //check("passwordConfirm").notEmpty().withMessage("Your password confirmation is required"),

  validatorMiddleware
]; 

export const loginValidator = [
  check('email')
    .notEmpty().withMessage('email is required')
    .isEmail().withMessage('enter an in valid email'),
  check('password')
    .notEmpty().withMessage('your password is required')
    .isLength({ min: 8 }).withMessage('must be at least 8 characters'),

  validatorMiddleware
]