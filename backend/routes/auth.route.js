import express from "express";
import { signUp, logIn, logOut, protect, updateProfile, checkAuth } from '../services/Auth.Services.js';
import {signValidator,loginValidator} from '../utils/validators/authValidators.js'

const router = express.Router();

router
  .route('/signup')
  .post(signValidator,signUp);

router
  .route('/login')
  .post(loginValidator,logIn);

router
  .route('/logout')
  .post(logOut);

router
  .route('/update-profile')
  .put(protect, updateProfile);

router.route('/check').get(protect, checkAuth);

export default router;