import express from "express";
import http from "http";
import { join } from "path";
import expressLayouts from "express-ejs-layouts";
import httpStatus from "http-status-codes";
import morgan from "morgan";
import multer from 'multer'; //multipart/form-data dekódoló
import favicon from 'serve-favicon';

//az app könyvtára
import { __dirname } from "./dirname.mjs";
import * as userController from './controllers/userController.mjs';
import * as formController from './controllers/formController.mjs';
import * as reservationController from './controllers/reservationController.mjs';

// import * as carsController from './controllers/carsController.mjs';

const app = express();


app.use(express.urlencoded({ extended: false })); //default form 
app.use(express.json()); //json post dekódoló


import { TEMPDIR } from './appdirs.mjs'; 
//middleware egy fájl feltöltéséhez
const mUploads = multer({ dest: TEMPDIR });

//EJS a sablonkezelő
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/layout"); //teljes oldal sablonok helye

//szessziókezelő modul
import session from "express-session";
import filestore from "session-file-store";
const FileStore = filestore(session); //szesszió adatok fájlban tárolva
app.use(
  session({
    store: new FileStore(), //állományba kerül kimentésre a session objektum
    secret: "Nilus macska titkos 🔑-a", //a sütik aláírására használt kulcs
    resave: true,         //szesszió adatok mentésére megadott opciók
    saveUninitialized: true,
    cookie: {                 //szesszió lejárati ideje
      maxAge: 1000 * 60 * 30, //1 sec * 60 * 30 = 30 perc
    },
  })
);

//statikus könyvtárak a .css, .js fájloknak és képeknek
app.use("/css", express.static(join(__dirname, "assets/css")));
app.use("/js", express.static(join(__dirname, "assets/js")));
app.use("/images", express.static(join(__dirname, "assets/images")));
// app.use(favicon(__dirname + '/assets/images/favicon.ico'));

app.get( "/user/index" , (req, res) => {
 
  res.render("index");
});

app.get("/user/main", (req, res) => {

  if(req.session.user){
    console.log("user_bejelentkezve");
    carsController.getCarsList(req,res);
  } else{
    console.log("user_nincs_bejelentekzve");
    res.render("login");
  }

});

app.get("/user/login", userController.getLogin);
app.post("/user/login", userController.postLogin);

app.get("/user/register", userController.getRegister);
app.post("/user/register", userController.postRegister);
console.log("itt");

app.post('/reservation', reservationController.createReservation);

app.get('/form', formController.getAddServiceForm);
app.post('/form', formController.createService);



console.log("tul");

app.use("/logout", (req, res) => {
  console.log("Logout");
  req.session.user = null;
  res.render("login");

});

const server = http.createServer(app);

const port = process.env.PORT || 3000;
// debug(`app port száma: ${port}`)

server.listen(port, () => {
  console.log(`szerver fut PORT=${port}`);
});
