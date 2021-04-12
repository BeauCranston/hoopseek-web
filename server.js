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
  });
require("dotenv").config();
app.use(cors());





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


