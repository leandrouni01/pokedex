const express = require('express');
const routeProtector = express.Router();
const jwt = require("jsonwebtoken");
require('dotenv').config();

routeProtector.use((req, res, next) => {
    let token;
    if(req.headers['authorization']){
      token = req.headers['authorization'].split(" ")[1];
    }
    
    if (token) {
      jwt.verify(token, process.env.SECRETKEY , (err, decoded) => {  
        if (err) {
          return res.status(409).json({ mensaje: 'Token inválida' });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res.status(409).send({ 
          mensaje: 'Token no proveída.' 
      });
    }
 });

exports.routeProtector = routeProtector;