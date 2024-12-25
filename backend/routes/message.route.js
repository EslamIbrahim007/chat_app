import express from "express";

import {protect} from "../services/Auth.Services.js"
import { getUsers,getMessage,sendMessage } from '../services/messageServices.js'
const router = express.Router();

router
  .route('/users')
  .get(protect, getUsers);

router
  .route('/:id')
  .get(protect, getMessage);
router
  .route('/send/:id')
  .post(protect, sendMessage);

export default router;