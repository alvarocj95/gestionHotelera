const mongoose = require('mongoose');

let limpiezaSchema = new mongoose.Schema({
    idHabitacion:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "habitaciones"
    },
    fechaHora:{
        type: Date, 
        default: Date.now
    },
    observaciones:{
        type: String,
        minlength: [5, "Las observaciones deben tener al menos 5 caracteres"]
    }
})

let Limpieza = mongoose.model("limpiezas", limpiezaSchema);
module.exports = Limpieza