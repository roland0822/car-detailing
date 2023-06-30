import { conn } from "../db/mysqlconn.mjs";

export async function createReservation(req, res, next) {
  const { email, service, date } = req.body;
console.log("bent");
console.log(email, service, date);
  try {
    const [rows, fields] = await conn.execute(
      'INSERT INTO reservation (customer_email, category, reservation_date) VALUES (?, ?, ?)',
      [email, service, date]
    );

    if (rows.affectedRows !== 1) {
      res.status(500).json({ message: 'A foglalás rögzítése sikertelen volt' });
      return;
    }

    res.status(200).json({ message: 'A foglalás sikeresen rögzítve lett' });
  } catch (err) {
    next(err);
  }
}

