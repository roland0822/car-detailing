
import express from 'express';
import * as userController from '../controllers/userController.mjs';

export const router = express.Router();

//regisztrálás
router.get('/register', userController.register );
router.post('/register', userController.postRegister );
//bejelentkezés
router.get('/login', userController.login );
router.post('/login', userController.postLogin );

//ezt csak akkor hívhatja meg, ha be van jelentkezve
router.get('/logout', userController.isAuth([]), userController.logout);