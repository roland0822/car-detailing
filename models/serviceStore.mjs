import { conn } from "../db/mysqlconn.mjs";
// import { conn } from "../db/mysqlpool.mjs";
import Joi from "joi";
//az insert és update lekérdezések összeállításában segít
//lásd a modul magyarázatait
import generateValueList from '../db/sql-list.mjs';



import debugMsg from "debug";
const debug = debugMsg("app:gyakStore");


export async function insert(data) {
    if (typeof data != "object"){
      return next(new Error('insert paramétere nem objektum'));
    }
    
    debug(`insert object: %o`, data);
    const [valueList, placeHolders] = generateValueList(data);
    const result = await conn.execute(
      `INSERT INTO services (${valueList}) VALUES (${placeHolders})`,
      data
    );
    debug(`gyak insert id: ${result[0].insertId}`);
    return result[0].insertId;
  }