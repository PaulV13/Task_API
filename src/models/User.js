
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
  name: String,
  password: String,
  email: String,
  date: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('User', usuarioSchema);