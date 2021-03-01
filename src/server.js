require("dotenv").config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const tareasRoutes = require("./routes/tareas");
const usuariosRoutes = require("./routes/usuarios");
const validateToken = require("./middlewares/validate-token")

//Conexion a la base de datos mongodb
mongoose
  .connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then((db) => console.log("Base de datos conectada"))
  .catch((err) => console.log(err));

//Configuracion
app.set('host', process.env.HOST || '0.0.0.0')
app.set('port', process.env.PORT || 3001);
app.set('json spaces', 2);

//Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

//Rutas
app.use("/api/tareas", validateToken, tareasRoutes);
app.use("/api/usuarios", usuariosRoutes);

//Empezando el servidor
app.listen(app.get('port'), app.get('host'), () => {
  console.log(`Server on port ${app.get('port')}`);
});