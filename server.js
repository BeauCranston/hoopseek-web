require("dotenv").config();
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const { Pool, Client } = require('pg');
const { query } = require("express");
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

function queryPostgres(query, res){
    console.log('connecting...')
    pool.connect((err, client, release) => {
        console.log('connected')
        if (err) {
            res.json({result:err, success:false});
            console.log('Error acquiring client', err.stack);
            return; 
        }
        console.log('connection successful, querying...')
        client.query(query, (err, result) => {
            console.log('made it');
            release();
            if (err) {
                res.json({result: err, success:false});
                return console.error('Error executing query', err.stack);
            }
            console.log(result.rows);
            res.json({result:result.rows, success:true});
        });
    });
}


app.get('/hoopseekAPI/getCourts', (req, res)=>{
    queryPostgres('SELECT * FROM courts', res)
});
app.get('/hoopseekAPI/updateCourt', (req, res)=>{
    console.log('querying database...')
    queryPostgres(`
    UPDATE courts 
    SET court_condition = '${req.query.court_condition}',
        three_point_line = ${req.query.three_point_line},
        backboard_type = '${req.query.backboard_type}',
        mesh_type = '${req.query.mesh_type}',
        lighting = '${req.query.lighting}',
        parking = '${req.query.parking}'
    WHERE court_id = ${req.query.court_id}
    `, res)
})
if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, "client/build")));
    app.get('*', (req, res)=>{
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    })
}
const port = process.env.PORT || 4000
app.listen(port, () =>{
  console.log(`Express server is running on localhost:${port}`);
  console.log(process.env.NODE_ENV);
  console.log(process.env.REACT_APP_GOOGLEMAPSAPIKEY);
});


