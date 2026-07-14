import express from 'express';
import {checkToken, updateProfile, signup, login, logout } from '../control/auth.control.js';
import { protect } from "../middlelayer/midway.middlelayer.js";
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.put("/update",protect, updateProfile );
router.get("/check",protect, checkToken );

export default router;
    