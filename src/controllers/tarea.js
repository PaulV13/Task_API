const Tarea = require('../models/tarea');
const Usuario = require('../models/User');

module.exports = {
  getTareas: async (req, res) => {
    try {
      const tareas = await Tarea.find({});
      res.status(200).json(tareas);
    } catch (error) {
      res.status(400).json(error);
    }
  },

  getTareasUsuario: async (req, res) => {
    try {
      const { _id } = req.params;
      const tareas = await Tarea.find({ usuario: _id });
      res.status(200).json(tareas);
    } catch (error) {
      res.status(400).json(tareas);
    }  
  },

  nuevaTarea: async (req, res) => {
    if (req.body.nombre === "") return res.status(400).json({error:"La tarea es requerida"});
    
    try {
      const { _id } = req.params;
      const nuevaTarea = new Tarea(req.body);
      const user = await Usuario.findById(_id);
      const tarea = await nuevaTarea.save();
      tarea.usuario = user;
      await tarea.save();
      await user.save();
      res.status(200).json({ tarea, error: null });
    } catch (error) {
      res.status(400).json(error);
    } 
  },

  getTarea: async (req, res) => {
    try {
      const { tareaId } = req.params;
      const tarea = await Tarea.findById(tareaId);
      res.status(200).json(tarea);
    } catch (error) {
      res.status(400).json(error);
    }
  },

  editarTarea: async (req, res) => {
    try {
      const { tareaId } = req.params;
      const datoAModificar = req.body;
      await Tarea.findByIdAndUpdate(tareaId, datoAModificar);
      const tareaModificada = await Tarea.findById(tareaId)
      res.status(200).json(tareaModificada);
    } catch (error) {
      res.status(400).json(error);
    }
  },

  eliminarTarea: async (req, res) => {
    try {
      const { tareaId } = req.params;
      await Tarea.findByIdAndRemove(tareaId);
      res.status(200).json({ success: true, message: "Tarea eliminada correctamente" });
    } catch (error) {
      res.status(200).json(error);
    }
  },
};