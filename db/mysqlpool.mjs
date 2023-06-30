//promise + connection pool használata

import mysql2 from "mysql";

const getPool = async () => {
  try{
    const pool = mysql2.createPool({
      host: "localhost",
      user: "detailing",
      database: "detailing",
      password: "alma333",
      // waitForConnections: true,
      connectionLimit: 10,
      // maxIdle: 10,
      // idleTimeout: 60000,
      // queueLimit: 0,
      namedPlaceholders: true,
      dateStrings: true
    });
    const promisePool = pool.promise();
    return promisePool;
  } catch (err) {
    console.log(err.message);
  }
}

const pool = require('./database');

const tableBody = document.querySelector('#servicesTable tbody');

pool.query('SELECT * FROM services', (error, results) => {
  if (error) {
    console.error('Error retrieving services:', error);
  } else {
    const rows = results[0].resultSet;
    rows.forEach((row) => {
      const { service_id, description, price } = row;
      console.log(service_id ," + ", description)
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>${service_id}</td>
        <td>${description}</td>
        <td>${price}</td>
      `;
      tableBody.appendChild(newRow);
    });
  }
});


export const conn = await getPool();