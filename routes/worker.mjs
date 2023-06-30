
import express from 'express';
import * as gyakController from '../controllers/gyakController.mjs';
import { isAuth } from '../controllers/userController.mjs';
import multer from 'multer'; //multipart/form-data dekódoló
import { TEMPDIR } from '../appdirs.mjs';
//multer  a fájlok feltöltéséhez
//példák itt: https://www.npmjs.com/package/multer
const mUploads = multer({ dest: TEMPDIR });

export const router = express.Router();

//gyakorlat beszámolók listája
router.get(['/list'], isAuth(['user','worker']), gyakController.list );

//egy gyakorlat részletes adatai
router.get(['/detail/:id'], isAuth(['user','worker']), gyakController.detail );

//gyakorlat beszámoló bevitele
router.get('/insert', isAuth(['user']), gyakController.getInsertForm);
//ha az űrlap multipart-form-data, akkor a multer-t le kell futtatni a controller előtt
router.post('/insert', isAuth(['user']), mUploads.single('upl'), gyakController.postInsertForm);

