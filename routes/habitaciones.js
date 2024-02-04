const express = require('express');
const upload = require(__dirname + '/../utils/uploads.js');

const Habitacion = require('../models/habitacion');
const Limpieza = require('../models/limpieza');
const router = express.Router();
const auth = require(__dirname + '/../utils/auth.js');


//Obtener un listado de todas las habitaciones:
//PERFECTA
router.get('/', (req, res) => {
    Habitacion.find().then(resultado => {
        res.render('habitaciones_listado', {habitaciones: resultado});
    }).catch (error => {
        res.render('error', {error: 'No existen habitaciones'});
    }); 
});

router.get('/nueva', (req, res) => {
    res.render('habitaciones_nueva');
});

router.get('/editar/:id', (req, res) => {
    Habitacion.findById(req.params.id).then(habitacion => {
        if(habitacion)
            res.render('habitaciones_edicion', {habitacion: habitacion});
    })
    .catch(error => {
        res.render('error', {error: 'No existe una habitación con ese ID'});
    })
});


//Obtener detalles de una habitación específica:
//PERFECTA
router.get('/:id', (req, res) => {
    Habitacion.findById(req.params.id).then(resultado => {
        if(resultado)
        res.render('habitaciones_ficha', {habitaciones: resultado, });
        else
        res.render('error', {error: 'No existe ninguna habitación con ese ID'});
    }).catch (error => {
        res.render('error', {error: 'Error buscando habitación'});
    }); 
});


//Insertar una habitación
//PERFECTA
router.post('/', auth.autenticacion, upload.upload.single('foto'), (req, res) => {
    let nuevaHabitacion = new Habitacion({
        numero: req.body.numero,
        tipo: req.body.tipo,
        descripcion: req.body.descripcion, 
        precio: req.body.precio
    });
    if(req.file)
    nuevaHabitacion.imagen = req.file.filename;

    nuevaHabitacion.save().then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        let errores = {
            general: 'Error insertando habitación'
        };
        if(error.errors.descripcion)
        {
            errores.descripcion = error.errors.descripcion.message;
        }
        if(error.errors.precio)
        {
            errores.precio = error.errors.precio.message;
        }

        res.render('habitaciones_nueva', {errores: errores, datos: req.body});
    });
});

//Actualizar los datos de una habitación
//PERFECTA
router.post('/:id', upload.upload.single('foto'), (req, res) => {
  Habitacion.findById(req.params.id).then((habitacion) => {
    if (habitacion) {
        habitacion.numero = req.body.numero;
        habitacion.tipo = req.body.tipo;
        habitacion.precio = req.body.precio;
        habitacion.descripcion = req.body.descripcion;
        if(req.file){
            habitacion.imagen = req.file.filename;
        }
        habitacion.save().then(() => {
            res.redirect(req.baseUrl + '/' + req.params.id);
        })
        .catch(error => {
            res.render('error', {error: "Error actualizando los datos de la habitación"});
        });
    }
    else {
        res.render('error', {error: "No existe una habitación con ese ID"});
    }
  })
  .catch(error => {
    res.render('error', {error: "Error actualizando los datos de la habitación"});
  })
});

//Eliminar una habitación
//PERFECTA
router.delete('/:id', auth.autenticacion, (req, res) => {
    Habitacion.findByIdAndRemove(req.params.id).then(resultado => {
        if (resultado)
            Limpieza.deleteMany({idHabitacion: req.params.id}).then(()=>{
                Habitacion.find().then(resultado => {
                    res.render('habitaciones_listado', {habitaciones: resultado, msg: "Habitación eliminada con exito"});
                })
            })
        else
            res.render('error', {error: "No existe ninguna habitación con ese ID"});
    }).catch(error => {
        res.render('error', {error:"Error eliminando la habitación"});
    });
    
});

//Añadir una incidencia en una habitación:
//PERFECTA
router.post('/:id/incidencias', upload.upload2.single('foto'), (req, res) => {
    Habitacion.findById(req.params.id).then((resultado) => {
        if (resultado) {
            let nuevaIncidencia = {
                descripcion: req.body.descripcion,
            };
            if (req.file) {
                nuevaIncidencia.imagen = req.file.filename;
            }

            resultado.incidencias.push(nuevaIncidencia);
            resultado.save().then(() => {
                res.redirect(req.baseUrl + '/' + req.params.id);
            }).catch(error2 => {
                let errores = {
                    general: 'Error insertando incidencia'
                };

                if (error2.errors.descripcion) {
                    errores.descripcion = error2.errors.descripcion.message;
                }
                res.render('habitaciones_ficha' , { errores: errores, datos: req.body, habitaciones: resultado });
            });

        } else {
            res.render('error', { error: "No existe el numero de habitación" });
        }
    }).catch(error => {
        res.render('error', { error: "Error buscando la habitación indicada" });
    });
});


//Actualizar el estado de la incidencia de una habitación
//PERFECTA
router.post('/:idH/incidencias/:idI', (req, res) => {
    Habitacion.findByIdAndUpdate(req.params.idH, {}, { new: true })
        .then(resultado => {
            if (resultado) {
                const incidencia = resultado.incidencias.id(req.params.idI);
                if (incidencia) {
                    incidencia.fechaFin = Date.now();
                    resultado.save()
                        .then(updatedResultado => {
                            res.render('habitaciones_ficha', {habitaciones: updatedResultado });
                        })
                        .catch(error => {
                            res.render('error', {error: "Error actualizando los datos de la habitación" });
                        });
                } else {
                    res.render('error', {error: "No existe una incidencia con este id" });
                }
            } else {
                res.render('error',{error: "No existe una habitación con este id" });
            }
        })
        .catch(error => {
            res.render('error',{error: "Error actualizando los datos de la habitación" });
        });
});


//Actualizar el estado de una limpieza de una habitación:
//PERFECTA
// router.put('/:id/ultimalimpieza', (req, res) => {   
//     const idHabitacion = req.params.id;

//     Habitacion.findByIdAndUpdate(idHabitacion, {}, { new: true })
//         .then(resultado => {
//             if (resultado) {
//                 Limpieza.findOne({ idHabitacion: idHabitacion }).sort({ fechaHora: -1 })
//                     .then(ultimaLimpieza => {
//                         if (ultimaLimpieza) {
//                             resultado.set({ultimaLimpieza: ultimaLimpieza.fechaHora});
//                             resultado.save().then(resultadoG =>{
//                                 res.render('habitaciones_ficha', {habitaciones: resultadoG });
//                             })
//                         } else {
//                             res.render('error',{
//                                     error: "No hay registros de limpieza para esta habitación"
//                                 });
//                         }
//                     })
//                     .catch(error => {
//                         res.render('error',{error: "Error al obtener la última limpieza"
//                             });
//                     });
//             } else {
//                 res.render('error',{
//                         error: "No hay habitaciones registradas con ese id"
//                     });
//             }
//         })
//         .catch(error => {
//             console.error(error);
//             res.render('error',{
//                     error: "Error al obtener la habitación"
//                 });
//         });
// });

//Actualizar todas las últimas limpiezas
// router.put('/ultimaLimpieza', (req, res) =>{
//     Habitacion.find().then(resultado1 => {
//         resultado1.forEach(habitacion => {
//             Limpieza.findOne({idHabitacion: habitacion.id}).sort({fechaHora: -1}).then(resultado => {
//                 habitacion.set({ultimaLimpieza : resultado.fechaHora});
//                 habitacion.save();
//             }).catch(error => {
//                 res.status(400).send({error: "B"});
//             });
//         });
//         res.status(200).send({resultado: resultado1 });
//     }).catch(error => {
//         res.status(400).send({error: "C"});
//     });
// });


module.exports = router;