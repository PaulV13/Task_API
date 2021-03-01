
const router = require('express-promise-router')();

const {getUsuario, getUsuarios, registrar, login, googlelogin, eliminarUsuario } = require('../controllers/usuario');

router.get("/", getUsuarios);
router.get("/:_id", getUsuario);
router.delete("/:_id", eliminarUsuario);
router.post("/registrar", registrar);
router.post("/login", login);
router.post("/googlelogin", googlelogin)

module.exports = router;