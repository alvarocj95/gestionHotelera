const mongoose = require('mongoose');
let incidenciaSchema = new mongoose.Schema({
    descripcion: {
        type: String,
        required: [true, "La descripción de la incidencia es obligatoria"],
        minlength: [5, "La descripción debe tener al menos 5 caracteres"]
    },
    fechaInicio:{
        type: Date,
        default: Date.now, 
    },
    fechaFin: {
        type: Date,
    }, 
    imagen:{
        type: String, 
    }
})


let habitacionSchema = new mongoose.Schema({
    numero:{
        type: Number,
        required: true,
        min: [0, "El número de habitación debe ser mayor o igual a 0"], 
        max: [100, "El número de habitación debe ser menor o igual a 100"]
    },
    tipo:{
        type: String,
        enum: ["individual", "doble", "familiar", "suite"]
    },
    descripcion: {
        type: String,
        minlength: 5,
        required: [true, "La descripción es obligatoria"] 
    },
    ultimaLimpieza: {
        type: Date, 
        default : Date.now,
        required: [true, "La fecha de la última limpieza es obligatoria"]
    },
    precio: {
        type: Number, 
        required: true,
        min: [0, "El precio debe ser mayor o igual a 0"],
        max: [250, "El precio debe ser menor o igual a 250"]
    },
    imagen:{
        type: String
    },
    incidencias: [incidenciaSchema]
})



let Habitacion = mongoose.model('habitaciones', habitacionSchema);
module.exports = Habitacion;
