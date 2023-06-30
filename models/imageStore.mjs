import { conn } from "../db/mysqlconn.mjs";
// import { conn } from "../db/mysqlpool.mjs";
import Joi from "joi";
import { readFile } from "fs/promises"
import mime from "mime"
import debugMsg from "debug";
import { readSync } from "fs";
const debug = debugMsg("app:imageStore");

//kép beszúrása a kepek táblába
export async function insert(tempname, filename, mime, hossz) {
  console.log("Insert");
  // csak 1 MB alatti méreteket írunk adatbázisba
  if (hossz > 1000000) {
    throw new Error("A feltöltött fájl túl nagy, max. 1 MB lehet");
  }

  // beolvassuk
  let data = await readFile(tempname);//Buffer adattípust ad vissza
  
  debug(`insert: ${filename}, ${mime}, ${hossz}`);
  console.log(filename);
  console.log(data);
  const [results, fields] = await conn.execute(
    "INSERT INTO pictures (name, mime, lenght, data) VALUES (?, ?, ?, ?)",
    ["service6.jpg","image/jpg" , "3072", data]
  );
  console.log("feltoltve");
  debug(`insert id: ${results.insertedId}`);
  console.log(results.insertId);
  return results.insertId;
}

export async function getImage(id){

  const [results, fields] = await conn.execute(
    `SELECT name, mime, lenght, data FROM pictures WHERE id = :id`,
    {id}
  );
  const {name, mime, lenght, data} = results[0];
  debug(`kép adatok: ${name}, ${mime},${lenght},méret: ${data.length}`);
  return results[0];
}