const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const { Pool, Client } = require('pg');
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: {
        rejectUnauthorized: false
    }
  });
require("dotenv").config();
app.use(cors());


// (async ()=>{
//     const client = await pool.connect();
//     try{
//         const res = await client.query("INSERT INTO courts(park_name, latitude, longitude, area, court_condition, mesh_type, lighting, parking, three_point_line, backboard_type) VALUES ('test', 43.29345258,-79.92034522, 'Hamilton Mountain', 'Good', 'Fabric','No Lights', 'Parking Lot', TRUE, 'Metal')");
//         console.log(res.rows);
//     }finally{
//         client.release()
//     }
// })().catch(err => console.log(err));

app.get('/hoopseekAPI/getCourts', (req, res)=>{
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query(`SELECT * FROM courts`, (err, result) => {
            release()
            if (err) {
            return console.error('Error executing query', err.stack)
            }
            console.log(result.rows)
            res.json(result.rows);
        });
    });
});

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, "client/build")));
    app.get('*', (req, res)=>{
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    })
}
const port = process.env.PORT || 4000
app.listen(port, () =>
  console.log(`Express server is running on localhost:${port}`)
  
);


