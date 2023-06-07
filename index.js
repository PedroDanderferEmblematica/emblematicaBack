'use strict';

const express = require('express'), bodyParser = require('body-parser'), nodemailer = require("nodemailer"), cors = require('cors');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

app.post('/', async function (req, res){
    let name = req.body.name, email = req.body.email, content=req.body.content;

    let response = {
        status: null,
        errors:[]
    }

    if(name.length <= 2 || name.length >= 30){
        response.status = false,
        response.errors.push({
            error: 'name',
            message: 'Debe tener un minimo de dos y un máximo de trainta caracteres.'
        })
    }
    if(/^[a-zA-Z ,.'-]+$/.exec(name) == null){
            response.status = false,
            response.errors.push({
                error: 'name',
                message: 'Solo puede contener letreas y espacios.'
            })
    }

    if(email.length <= 5 || email.length >= 50){
        response.status = false,
        response.errors.push({
            error: 'email',
            message: 'Debe tener un minimo de cinco y un máximo de cincuenta caracteres.'
        })
    }
    if(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.exec(email) == null){
        response.status = false,
        response.errors.push({
            error: 'email',
            message: 'El email ingresado no es valido.'
        })
    }

    if(content.length <= 15 || content.length >= 500){
        response.status = false,
        response.errors.push({
            error: 'content',
            message: 'Debe tener un minimo de quince y un máximo de quinientos caracteres.'
        })
    }
    if(/^[a-zA-Z0-9 +(),.'-]+$/.exec(content) == null){
            response.status = false,
            response.errors.push({
                error: 'content',
                message: 'Solo puede contener a-zA-Z0-9 , . () - +.'
            })
    }
    
    
    if(response.status == false){
        res.send(response);
    }else{
        const config = {
            host: 'smtp.gmail.com',
            port: 587,
            auth:{
                user:'danderferpedro@gmail.com',
                pass:'wagvvwqnicyllvwg'
            }
        }
    
        const transport = nodemailer.createTransport(config);
    
        const mensaje = {
            from: 'danderferpedro@gmail.com',
            to: 'danderferpedro@gmail.com',
            subject:'Cliente desde la web: '+name,
            text: 'Hola! Me llamo '+name+', mi email es: '+email+'. A continuación dejo el siguiente mensaje desde tu web: '+content
        }
    
        await transport.sendMail(mensaje)
        .then((data)=>{
            res.send({
                status: true
            })
        })
        .catch((e)=>{
            res.send({
                status: false,
                error: 'Opss... Ocurrio un error.'
            })
        });

    }
});

app.listen('8080', function(){
    console.log('Server runing on port 8080');
});