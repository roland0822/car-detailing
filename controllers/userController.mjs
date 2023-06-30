import { conn } from "../db/mysqlconn.mjs";
import Joi from "joi";
import { createHash } from "crypto";
import debugMsg from 'debug';
const debug = debugMsg('app:userController'); 
import * as serviceController from './serviceController.mjs';
export async function endConn() {
  await conn.end();
}


export async function getRegister(req, res, next) {
  res.render("register");
}

export async function getForm(req, res, next) {
  res.render("form");
}

export async function getIndex(req, res, next) {
  res.render("index");
}

//POST kérés kiszolgálása a regisztráláshoz
//űrlap fogadás
export async function postRegister(req, res, next) {
  const userData = req.body;
  // delete userData.submit;

  let rows = null;
  let fields = null;
  try {
    [rows, fields] = await conn.execute(
      "SELECT email FROM `user` WHERE email = :email",
      {
        email: userData.email,
      }
    );
  } catch (err) {
    next(err);
    return;
  }

  if (rows[0]) {
    //ha nincs, akkor ez undefined
    res.send(`Ezzel az felhasználónévvel már regisztráltak: ${userData.email}`);

    return;
  }

  const hash = createHash("sha1").update(userData.password).digest("hex");

  try {
    [rows, fields] = await conn.execute(
      "INSERT INTO `user` (name, email, password, role) VALUES (:name, :email, :hash, :role)",
      {
        name: userData.name,
        email: userData.email,
        hash: hash,
        role: "customer",
      }
    );
    console.log(rows);
  } catch (err) {
    next(err);
    return;
  }

  if (rows.affectedRows != 1) {
    res.send("Az akalmazás hibába futott");

  return;
}
res.render("login");


}

//GET kérés kiszolgálása a bejelentkezéshez
//űrlap kiküldés
export async function getLogin(req, res, next) {
  if(req.session.user){
    console.log("itt");
    serviceController.getServiceList(req,res,next);
  }else{
    res.render("login");
  }
}

//POST kérés kiszolgálása a bejelentkezéshez
//űrlap fogadás és bejelentkezés
export async function postLogin(req, res, next) {
  const userData = req.body;
  console.log("Bejelentkezes");
  debug(`login próbálkozás: %o`, userData);

  const hash = createHash("sha1").update(userData.password).digest("hex");
  
  let rows = null;
  let fields = null;

  try {
    [rows, fields] = await conn.execute(
      "SELECT email, name, role FROM `user` WHERE email = :email AND password = :hash",
      {
        email: userData.email,
        hash: hash,
      }
    );
  } catch (err) {
    next(err);
    return;
  }

  if (rows.length !== 1) {
    res.render("login", {
      userData: {
        email: userData.email,
      },
      error: "Bejelentkezés nem sikerült, nincs ilyen név/jelszó pár.",
    });
    return;
  }

  serviceController.getServiceList(req,res,next);
}

//kijelentkezés
export async function logout(req, res, next) {
  debug(`logout %o`,req.session.user);
  //töröljük a felhasználó adatait a szesszióból
  req.session.user = null;
  //mentjük a szesszió adatokat
  req.session.save(function (err) {
    if (err) return next(err);
    //újra indítjuk a szesszió belső adatait
    req.session.regenerate(function (err) {
      if (err) return next(err);
      //a főoldalra kerül kijelentkezve
      res.redirect("/");
    });
  });
}



