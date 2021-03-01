
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tareaSchema = new Schema({
  nombre: String,
  estado: Boolean,
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Tarea', tareaSchema);