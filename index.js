const express = require('express');
const app = express();
const path = require('path');
// db
const db = require('./config');
//cors
const cors=require('cors');
// body-parser
const bodyParser = require('body-parser');
// port
const port = parseInt(process.env.port) || 4000;

//Router
const route = express.Router();
// const {errorHandling}= require('./middleware/ErrorHandling');
// const {message}=require('./middleware/message');

app.use(
    route,
    cors({origin:['http://127.0.0.1:8080',
                'http://localhost:8080'],
            credentials:true}),
    express.json,
    bodyParser.urlencoded({extended: false})
)
route.get('/',(req, res) => {
    res.status(200).sendFile(path.join(__dirname, './view/index.html'));
});
route.get('/USERS', function (req,res) {
    db.query('SELECT USERNAME,EMAIL  from USERS ', (err, data) => {
        if (err) {
         console.log(err); 
        }
        else{
            res.status(200).json( {results: data} )
        }
    });
});
route.get('/PRODUCTS', function (req,res) {
    db.query('SELECT PRODUCTNAME,PRODUCTSIZE,QUANTITY,STYLE from PRODUCTS', (err, data) => {
        if (err) {
         console.log(err);
        }
        else{
            res.status(200).json( {results: data} )
        }
    });
});

route.post('/ADDPRODUCTS',bodyParser.json(),(req,res)=>
{
    let detail = req.body;

    //sql query 
    const strQry =
    `INSERT INTO PRODUCTS SET ?;
    `
    db.query(strQry,[detail],(err)=>{
        if(err){
            res.status(400).json({err});
        }
        else{
            res.status(200).json({msg:'A product was added'})
        }}
)}
)
route.post('/ADDUSER',bodyParser.json(),(req,res)=>
{
    let detail = req.body;

    //sql query 
    const strQry =
    `INSERT INTO USERS SET ?;
    `
    db.query(strQry,[detail],(err)=>{
        if(err){
            res.status(400).json({err});
        }
        else{
            res.status(200).json({msg:'A USER was  added'})
        }}
)}
)

route.put('/product/:id', bodyParser.json(),(req, res) => {
    let data = req.body;
    const strQry =
    `
    update PRODUCTS
    set ?
    where ID = ?;
    `;

db.query(strQry, [data, req.params.id],
    (err)=>{
        if(err) throw err;
        res.status(200).json( {msg:
        "a row was affected"});
    })
});

route.put('/User/:id', bodyParser.json(),(req, res) => {
    let data = req.body;
    const strQry =
    `
    update USERS
    set ?
    where ID = ?;
    `;

db.query(strQry, [data, req.params.id],
    (err)=>{
        if(err) throw err;
        res.status(200).json( {msg:
        "a row was affected"});
    })
});



route.delete('/product/:id',bodyParser.json(),(req, res) => {
    const userId = req.params.id;
    const deleteQuery = 'DELETE  FROM PRODUCTS  WHERE ID = ?;';
  
    // Run MySQL delete query
   db.query(deleteQuery, [userId], (err) => {
      if (err) throw err;
      
      res.sendStatus(200).json({msg:`ok`});
    })
  }); 
route.delete('/user/:id',bodyParser.json(),(req, res) => {
    const userId = req.params.id;
    const deleteQuery = 'DELETE  FROM USERS  WHERE ID = ?;';
  
    // Run MySQL delete query
   db.query(deleteQuery, [userId], (err) => {
      if (err) throw err;
      
      res.sendStatus(200).json({msg:`ok`});
    })
  }); 





  
  app.listen(4000, () => {
    console.log('your app listening on port 4000!');
  });






 

