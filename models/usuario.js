const mongoose = require('mongoose');

let usuarioSchema = new mongoose.Schema({
    login:{
        type: String,
        minlength: 5,
        required: true
    },
    password:{
        type: String,
        minlength: 7,
        required: true
    }
})



let Usuario = mongoose.model("usuarios", usuarioSchema);
module.exports = Usuario