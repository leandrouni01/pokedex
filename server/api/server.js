const express = require('express');
const morgan = require('morgan');
const routes = require('./routes/routes');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
/*
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});*/
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//app.use(express.json());
app.use(morgan('dev'));
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname,'../../ui')));

app.listen(app.get('port'),()=>{
    console.log(`El servidor esta escuchando en el puerto ${app.get('port')}`);
});

routes(app);