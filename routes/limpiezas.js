const express = require('express');

let limpieza = require('../models/limpieza.js');

const Habitacion = require('../models/habitacion.js');
let router = express.Router();
const auth = require(__dirname + '/../utils/auth.js');


router.use((req, res, next) => {
    console.log(new Date().toString());
    console.log(req.method);
    console.log(req.baseUrl);
    next();
});

router.get('/nueva/:id', (req, res) => {
    Habitacion.findById(req.params.id).then(resultado => {
        if(resultado){
            const fecha = new Date();
            res.render('limpiezas_nueva', { habitacion: resultado, fecha: fecha });
        }
        else
        res.render('error', {error: 'No existe ninguna habitación con ese ID'});
    }).catch (error => {
        res.render('error', {error: 'Error buscando habitación'});
    }); 
});

//Obtener limpiezas de una habitación
//PERFECTA
router.get('/:id', (req, res) => {

    Habitacion.findById(req.params.id).then(resultado => {
        if(resultado)
        limpieza.find({ idHabitacion: req.params.id }).sort({ fechaHora: -1 }).then(limpiezas => {
            res.render('limpiezas_ficha', {limpiezas: limpiezas, habitacion: resultado});
        })
        else
        res.render('error', {error: 'No existe ninguna habitación con ese ID'});
    }).catch (error => {
        res.render('error', {error: 'Error buscando habitación'});
    }); 
});


//Obtener el estado de limpieza actual de una habitación
// router.get('/:id/estadolimpieza', (req, res) => {
//     const idHabitacion = req.params.id;

//     limpieza.findOne({ idHabitacion: idHabitacion }).sort({ fechaHora: -1 })
//         .then(resultado => {
//             if (resultado) {
//                 if (resultado.fechaHora < Date.now()) {
//                     res.status(200)
//                         .send({resultado: 'limpieza' });
//                 } else {
//                     res.status(200)
//                         .send({resultado: 'pendiente de limpieza' });
//                 }
//             } else {
//                 res.status(500)
//                     .send({error: "No hay limpiezas registradas para esa habitación"
//                     });
//             }
//         })
//         .catch(error => {
//             console.error(error);
//             res.status(500)
//                 .send({error: "Error al obtener el estado de limpieza"
//                 });
//         });
// });
       
//Actualizar limpieza
router.post('/:id', auth.autenticacion, (req, res) => {
    let nuevaLimpieza = new limpieza({
        idHabitacion : req.params.id,
        fechaHora : req.body.fechaHora,
        observaciones : req.body.observaciones

    })
    console.log(req.body.observaciones);
    nuevaLimpieza.save().then(resultado => {
        if (resultado)
        {
            res.redirect(req.baseUrl + '/' + req.params.id);
        }
    }).catch (error => {
        let errores = {
            general: 'Error insertando limpieza'
        };
        if(error.errors.observaciones)
        {
            errores.observaciones = error.errors.observaciones.message;
        }
        res.render('limpiezas_nueva', {errores: errores, datos: req.body});
    }); 
});

module.exports = router;