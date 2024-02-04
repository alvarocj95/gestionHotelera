const express = require('express');

let router = express.Router();
const Usuarios = require('../models/usuario');

// const usuarios = [
//     { usuario: 'nacho', password: '12345' },
//     { usuario: 'arturo', password: 'arturo111' }
// ];

router.get('/login', (req, res) => {
    res.render('login');
});

// router.post('/login', (req, res) => {
//     let login = req.body.login;
//     let password = req.body.password;
//     const usuarios = Usuarios.findOne({login: login, password: password});
//     let existeUsuario = usuarios.filter(usuario => usuario.usuario == login && usuario.password == password);
//     if (existeUsuario.length > 0) {
//         req.session.usuario = existeUsuario[0].usuario;
//         res.redirect('/habitaciones');
//     } else {
//         res.render('login', {error: "Usuario o contraseña incorrectos"});
//     }
// });

router.post('/login', async (req, res) => {
    try {
        let login = req.body.login;
        let password = req.body.password;
        
        const usuario = await Usuarios.findOne({ login: login, password: password });

        if (usuario) {
            req.session.usuario = usuario.login;
            res.redirect('/habitaciones');
        } else {
            res.render('login', { error: "Usuario o contraseña incorrectos" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;