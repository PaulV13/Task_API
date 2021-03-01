
const router = require('express-promise-router')();

const {
  getTareasUsuario,
  nuevaTarea,
  getTarea,
  editarTarea,
  eliminarTarea,
  getTareas,
} = require("../controllers/tarea");

router.get("/", getTareas);
router.get("/:_id", getTareasUsuario);
router.get("/:tareaId", getTarea);
router.post("/:_id", nuevaTarea);
router.put("/:tareaId", editarTarea);
router.delete("/:tareaId", eliminarTarea);

module.exports = router;
