const Nota = require("../models/Nota");
const Usuario = require("../models/User");

module.exports = {
  getNotas: async (req, res) => {
    try {
      const notas = await Nota.find({});
      res.status(200).json(notas);
    } catch (error) {
      res.status(400).json(error);
    }
  },

  getNotasUsuario: async (req, res) => {
    try {
      const { _id } = req.params;
      const notas = await Nota.find({ usuario: _id });
      res.status(200).json(notas);
    } catch (error) {
      res.status(400).json(error);
    }
  },

  nuevaNota: async (req, res) => {
    if (req.body.nombre === "")
      return res.status(400).json({ error: "La nota es requerida" });

    try {
      const { _id } = req.params;
      const nuevaNota = new Nota(req.body);
      const user = await Usuario.findById(_id);
      const nota = await nuevaNota.save();
      nota.usuario = user;
      await nota.save();
      await user.save();
      res.status(200).json({ nota, error: null });
    } catch (error) {
      res.status(400).json(error);
    }
  },

  getNota: async (req, res) => {
    try {
      const { notaId } = req.params;
      const nota = await Nota.findById(notaId);
      res.status(200).json(nota);
    } catch (error) {
      res.status(400).json(error);
    }
  },

  editarNota: async (req, res) => {
    try {
      const { notaId } = req.params;
      const datoAModificar = req.body;
      await Nota.findByIdAndUpdate(tareaId, datoAModificar);
      const notaModificada = await Nota.findById(notaId);
      res.status(200).json(notaModificada);
    } catch (error) {
      res.status(400).json(error);
    }
  },

  eliminarNota: async (req, res) => {
    try {
      const { notaId } = req.params;
      await Nota.findByIdAndRemove(notaId);
      res
        .status(200)
        .json({ success: true, message: "Tarea eliminada correctamente" });
    } catch (error) {
      res.status(200).json(error);
    }
  },
};
