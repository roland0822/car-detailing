
import { conn } from "../db/mysqlconn.mjs";
import * as image from "../models/imageStore.mjs";
import debugMsg from 'debug';
import * as service from "../models/serviceStore.mjs";
const debug = debugMsg('app:userController'); 
import path from 'path';

export async function endConn() {
  await conn.end();
}

export async function getAllCategories() {
    try {
      const [rows, fields] = await conn.execute('SELECT * FROM category');
      return rows;
    } catch (err) {
      throw err;
    }
  }

  export async function getAllWorkers() {
    try {
      const [rows, fields] = await conn.execute('SELECT * FROM user WHERE role = "worker"');
      return rows;
    } catch (err) {
      throw err;
    }
  }

  export async function getAddServiceForm(req, res, next) {
    console.log("itt");
    try {
      const categories = await getAllCategories();
      const workers = await getAllWorkers();
        // console.log(categories[1]);
        // console.log(workers[1]);
      res.render('form', { categories, workers });
    } catch (err) {
      next(err);
    }
  }


  export async function createService(req, res, next) {
    const { workers, category, price, description, kep } = req.body;
    console.log("jol vagyok nagyon");
    const data = req.body;
    console.log(workers);
    console.log(category);
    console.log(price);
    console.log(description);
    try {
      console.log("tryban");
      console.log(kep);
      // Process file upload if available
      if (kep) {
        const file = kep;
        const tempName = path.join("../04_website/assets/services", file);
  
        try {
          console.log("Insert elott");
          const id = await image.insert(tempName, file.originalname, file.mimetype, file.size);
  
          data.kepek_id = id;
          // await fs.unlink(tempName); 
        } catch (err) {
          return next(err);
        }
      }
      try {
        const [picRows, picFields] = await conn.execute('SELECT pic_id FROM pictures ORDER BY pic_id DESC LIMIT 1');
        const picId = picRows[0].pic_id ;
        const [rows, fields] = await conn.execute(
          'INSERT INTO services (description, price, worker_id, category_id, pic_id) VALUES (?, ?, ?, ?, ?)',
          [description, price, workers, category,picId]
        );
  
        if (rows.affectedRows !== 1) {
          res.status(500).json({ message: 'A szolgáltatás létrehozása sikertelen volt' });
          return;
        }
  
        res.status(200).json({ message: 'A szolgáltatás sikeresen létrehozva' });
      } catch (err) {
        next(err);
      }
      console.log("Sikeres letrehozas");
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }

    // try {
    //   const [rows, fields] = await conn.execute(
    //     'INSERT INTO services (description, price, worker_id, category_id, pic_id) VALUES (?, ?, ?, ?, ?)',
    //     [description, price, workers, category, "8"]
    //   );
  
    //   if (rows.affectedRows !== 1) {
    //     res.status(500).json({ message: 'A szolgáltatás létrehozása sikertelen volt' });
    //     return;
    //   }
  
    //   res.status(200).json({ message: 'A szolgáltatás sikeresen létrehozva' });
    // } catch (err) {
    //   next(err);
    // }
  
