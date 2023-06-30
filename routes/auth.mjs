
import express from 'express';
import {isAuth} from '../controllers/userController.mjs';

export const router = express.Router();

/*  a linkek az index.ejs-ben:

  <li><a href="/auth/user">Csak user</a></li>
  <li><a href="/auth/teacher">Csak teacher</a></li>
  <li><a href="/auth/admin">Csak admin</a></li>
  <li><a href="/auth/topusers">Csak teacher és admin</a></li>

  Az alábbi beálltások korlétozzák a hozzáférést az egyes útvonalakhoz

*/

//csak user
router.get('/user', isAuth(['user']), (req, res, next)=>{
  res.render('user', {});
});
//csak teacher
router.get('/teacher', isAuth(['teacher']), (req, res, next)=>{
  res.render('teacher', {});
});
//csak admin
router.get('/admin', isAuth(['admin']), (req, res, next)=>{
  res.render('admin', {});
});
//csak teacher
router.get('/topusers', isAuth(['teacher','admin']), (req, res, next)=>{
  res.render('topusers', {});
});