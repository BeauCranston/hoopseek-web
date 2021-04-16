require("dotenv").config();
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const fs = require('fs');
const { Pool, Client } = require('pg');
const { query } = require("express");
// get the db config information from the environment
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
/**
 * querys the postgres database with a specified query string and sends the result to the client.
 * @param {*} query - string query to send to db
 * @param {*} res  - the response object sent to the client
 */
function queryPostgres(query, res){
    console.log('connecting...')
    pool.connect((err, client, release) => {
        console.log('connected')
        //check if connection fails
        if (err) {
            res.json({result:err, success:false});
            console.log('Error acquiring client', err.stack);
            return; 
        }
        console.log('connection successful, querying...')
        client.query(query, (err, result) => {
            //release client from the pool to free up the pool after execution
            release();
            //check if query fails, respond to client with err
            if (err) {
                res.json({result: err, success:false});
                return console.error('Error executing query', err.stack);
            }
            console.log('done!')
            //send success response to client
            res.json({result:result.rows, success:true});
        });
    });
}
//when route is called it will get all of the courts from the database
app.get('/hoopseekAPI/getCourts', (req, res)=>{
    queryPostgres('SELECT * FROM courts', res)
});
//add the court to the databse when the route is called
app.get('/hoopseekAPI/addCourt', (req, res)=>{
    queryPostgres(`
    INSERT INTO courts (park_name, area, latitude, longitude, court_condition,three_point_line,backboard_type,mesh_type,lighting,parking)      
    VALUES('${req.query.park_name}', 
    '${req.query.area}', 
    '${req.query.latitude}', 
    '${req.query.longitude}',
    '${req.query.court_condition}', 
    ${req.query.three_point_line},
    '${req.query.backboard_type}',
    '${req.query.mesh_type}',
    '${req.query.lighting}',
    '${req.query.parking}')
    RETURNING *;
    `, res)
});
//updates a court with a specified id
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

//if the environment is in production then serve the index.html from the build folder
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
});


