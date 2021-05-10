const router = require("express-promise-router")();

const {
  getNotasUsuario,
  nuevaNota,
  getNota,
  editarNota,
  eliminarNota,
  getNotas,
} = require("../controllers/nota");

router.get("/", getNotas);
router.get("/:_id", getNotasUsuario);
router.get("/:notaId", getNota);
router.post("/:_id", nuevaNota);
router.put("/:notaId", editarNota);
router.delete("/:notaId", eliminarNota);

module.exports = router;
