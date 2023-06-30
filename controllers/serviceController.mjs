import { conn } from "../db/mysqlconn.mjs";
import * as image from "../models/imageStore.mjs";
import { unlink } from 'fs/promises';
import { join } from "path";
import debugMsg from "debug";
const debug = debugMsg("app:gyakController");

import { TEMPDIR } from '../appdirs.mjs';

export async function endConn() {
  await conn.end();
}

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export async function getServiceList(req, res) {
  const [rows, fields] = await conn.execute(
    `SELECT category.category as title, services.description, services.price, category.category
     FROM services
     INNER JOIN category ON services.category_id = category.category_id
    `
  );

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const imagesDirectory = path.join("assets/services");

  const files = fs.readdirSync(imagesDirectory);
  
  const list = rows.map((row, index) => {
    if (index < files.length) {
      const imageName = files[index];
      const imagePath = path.join(imagesDirectory, imageName);
      const imageData = fs.readFileSync(imagePath, { encoding: 'base64' });
    
      return { ...row, picture: imageData };
    } else {
      return row;
    }
  });

  res.render("main", { list });
}

