
const Usuario = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Joi = require('@hapi/joi')
const { OAuth2Client } = require('google-auth-library')

const schemaRegister = Joi.object().keys({
  name: Joi.string()
    .required()
    .regex(/^[a-zA-Z]{2,255}$/)
    .messages({
      "string.base": `Invalid type, name must be a string`,
      "string.empty": `Please enter your name`,
      "string.pattern.base": `Name only with letters`,
    }),
  email: Joi.string().required().email().messages({
    "string.base": `Invalid type, email must be a string`,
    "string.empty": `Please enter your email`,
    "string.email": `Email is not valid`,
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": `Invalid type, password must be a string`,
    "string.min": `Password must be longer than 6 characters`,
    "string.empty": `Please enter your password`,
  }),
});

const schemaLogin = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

const client = new OAuth2Client(
  "214450983443-eh2muv5nhvkk9q0r0l5rjmo4absmsjmv.apps.googleusercontent.com"
);

module.exports = {
  getUsuarios: async (req, res) => {
    try {
      const usuarios = await Usuario.find({}).populate("tareas")
      res.status(200).json(usuarios)
    } catch (error) {
      res.status(400).json(error)
    }
  },

  getUsuario: async (req, res) => {
    try {
      const { _id } = req.params
      const usuario = await Usuario.findById(_id).populate("tareas")
      res.status(200).json(usuario)
    } catch (error) {
      res.status(400).json(error)
    }
  },
  
  eliminarUsuario: async (req, res) => {
    try {
      const { _id } = req.params
      await Usuario.findByIdAndRemove(_id)
      res.status(200).json({ success: true })
    } catch (error) {
      res.status(400).json(error)
    }
  },

  registrar: async (req, res) => {
    const { error } = schemaRegister.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const email = req.body.email;
    const emailExist = await Usuario.findOne({ email });
    if (emailExist) {
      return res.status(400).json({
        error: `${email} already registered`,
      });
    } else {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const NuevoUsuario = new Usuario({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
        });
        const usuario = await NuevoUsuario.save();
        res.status(200).json({
          message: "You have registered successfully",
          user: usuario,
          error: null,
        }); 
      }
      catch (error) {
        res.status(400).json(error)
      }
    }
  },

  login: async (req, res) => {
    const { error } = schemaLogin.validate(req.body)
    if (error) {
      return res.status(400).json({ error: true, message: error.details[0].message })
    }

    const usuario = await Usuario.findOne({ email: req.body.email })
    if (!usuario) return res.status(400).json({
      error: true,
      message: "The email does not exist"
    });
    
    const validPass = await bcrypt.compare(req.body.password, usuario.password)
    if (!validPass) return res.status(400).json({
      email: req.body.email,
      error: true,
      message: "Password is incorrect",
    });
    
    const token = jwt.sign({
      id: usuario._id,
      name: usuario.name
    }, process.env.TOKEN_SECRET)

    res.header("auth-token", token).json({
      error: null,
      id: usuario._id,
      name: usuario.name,
      data: { token }
    })
  },

  googlelogin: async (req, res) => {
    const { tokenId } = req.body

    await client.verifyIdToken({ idToken: tokenId, audience: "214450983443-eh2muv5nhvkk9q0r0l5rjmo4absmsjmv.apps.googleusercontent.com" })
      .then(response => {
        const { email_verified, name, email } = response.payload
        if (email_verified) {
          Usuario.findOne({ email }).exec((err, user) => {
            if (err) {
              return res.status(400).json({
                error: "An error occurred",
              });
            }
            else {
              if (user) {
                const token = jwt.sign(
                  {
                    _id: user._id,
                  },
                  process.env.TOKEN_SECRET
                );

                const { _id, email, name } = user;

                res.json({
                  token,
                  user: { _id, name, email },
                });
              } else {
                let pass = email + process.env.SIGNIN_KEY
                let newUser = new Usuario({ name, email, pass })
                newUser.save((err, data) => {
                  if (err) {
                    return res.status(400).json({
                      error: "An error occurred",
                    });
                  } else {
                     const token = jwt.sign(
                       {
                         _id: data._id,
                       },
                       process.env.TOKEN_SECRET
                     );
                    
                    const { _id, email, name } = newUser

                     res.json({
                       token,
                       user: {_id, name, email}
                     });
                  }
                })
              }
            }
          })
        }
      })    
    }
  }