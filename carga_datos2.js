const mongoose = require('mongoose');

const Usuario = require(__dirname + "/models/usuario");

mongoose.connect('mongodb://127.0.0.1:27017/hotel');

let usuarios = [     
    new Usuario({ login: 'usuario1', password: 'password1' }),     
new Usuario({ login: 'admin', password: '12345678' }) ];

usuarios.forEach(l => l.save());
