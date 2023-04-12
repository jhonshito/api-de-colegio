
const { Usuario, Docente } = require('../models/models');
const  transporter  = require('../config/mailer')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const register = async(req, res) => {

    const { role } = req.body

    if(role == 'estudiante'){
        const { nombreCompleto, role, nacimiento, tipo_documento, documento, direccion, numero, correo, nombre_acudiente, nivel_academico, grado, numero_acudiente, contraseña } = req.body;

        // matricula del estudiante
        switch (true) {
            case !role:
                res.status(400).json({
                    mensaje: 'El campo del role es requerido'
                })
                break;
            case !nombreCompleto:
                res.status(400).json({
                    mensaje: 'El campo Nombre completo es requerido'
                })
                break;
            case !nacimiento:
                res.status(400).json({
                    mensaje: 'El campo Fecha de nacimiento es requerido'
                })
                break;
            case !tipo_documento:
                res.status(400).json({
                    mensaje: 'El campo del tipo de documento es requerido'
                })
                break;
            case !documento:
                res.status(400).json({
                    mensaje: 'El campo del documento es requerido'
                })
                break;
            case !nombre_acudiente:
                res.status(400).json({
                    mensaje: 'El campo Nombre del acudiente es requerido'
                })
                break;
            case !nivel_academico:
                res.status(400).json({
                    mensaje: 'El campo Nombre del nivel_academico es requerido'
                })
                break;
            case !grado:
                res.status(400).json({
                    mensaje: 'El campo Grado es requerido'
                })
                break;
            case !numero_acudiente:
                res.status(400).json({
                    mensaje: 'El campo Número del acudiente es requerido'
                })
                break;
            case !contraseña:
                res.status(400).json({
                    mensaje: 'El campo Contraseña es requerido'
                })
                break;
            case documento.length < 8:
                res.status(400).json({
                    mensaje: 'Tu documento tiene que tener mas de 7 numero'
                })
                break;
            case documento.length > 10:
                res.status(400).json({
                    mensaje: 'Tu documento no puede tener mas de 10 numero'
                })
                break;
            default:
                // Realizar el registro del usuario
    
                const users = await Usuario.findOne({correo: correo});
    
                if(!users){
    
                    const user = await Usuario.findOne({documento: documento})
    
                    if(!user){
                        bcrypt.hash(contraseña, 10, (err, contraseñaHasheada) => {
                            if(err) res.json(err)
                            else{
        
                                const usuario = new Usuario(
                    
                                    {
                                        role: role,
                                        fechaRegistro: new Date(),
                                        nombreCompleto: nombreCompleto, 
                                        nacimiento: nacimiento,
                                        tipo_documento: tipo_documento,
                                        documento: documento,
                                        direccion: direccion, 
                                        numero: numero, 
                                        correo: correo, 
                                        nombre_acudiente: nombre_acudiente, 
                                        grado: grado,
                                        nivel_academico: nivel_academico,
                                        numero_acudiente: numero_acudiente, 
                                        contraseña: contraseñaHasheada
                                    }
                                );
                                usuario.save().then((user) => {
                                    const token = jwt.sign({id: user._id, role: user.role}, process.env.secret, {
                                        expiresIn: 60 * 60 * 24
                                    });
        
                                    const { _id } = user
        
                                    res.json({
                                        mensaje: 'usuario matriculado',
                                        _id,
                                        token
                                    })
                                })
                            }
                        })
                    }else {
                        res.status(409).json({
                            mensaje: 'Tu documento ya se encuentra registrado'
                        })
                    }
                    // necesito capturar el error de si existe otro documento igual
    
                }else {
                    res.json({
                        mensaje: 'ya hay un usuario registrado con las misma credenciales'
                    })
                }
    
                break;
        }

    }else if(role == 'profesor'){
        const { nombreCompleto, role, nacimiento, documento, direccion, numero, correo, nivel_academico, años_de_experiencia, materias, contraseña } = req.body;

        // registro de Docentes
        switch(true){
            case !nombreCompleto:
                res.status(400).json({
                    mensaje: 'El campo del Nombre completo es requerido'
                });
                break;
            case !role:
                res.status(400).json({
                    mensaje: 'El campo del Role es requerido'
                });
                break;
            case !nacimiento:
                res.status(400).json({
                    mensaje: 'El campo de la Fecha de nacimiento es requerida es requerido'
                });
                break;
            case !documento:
                res.status(400).json({
                    mensaje: 'El campo del Documentoh es requerido'
                });
                break;
            case !numero:
                res.status(400).json({
                    mensaje: 'El campo del Numero de telefono es requerido'
                });
                break;
            case !correo:
                res.status(400).json({
                    mensaje: 'El campo del Correo es requerido'
                });
                break;
            case !nivel_academico:
                res.status(400).json({
                    mensaje: 'El campo del Nivel academico es requerido'
                });
                break;
            case !años_de_experiencia:
                res.status(400).json({
                    mensaje: 'El campo de los Años de experiencia es requerido'
                });
                break;
            case !contraseña:
                res.status(400).json({
                    mensaje: 'El campo de la Contraseña es requerido'
                });
                break;

            default:

                const profesor = await Docente.findOne({correo: correo})
                if(!profesor){
                    const docent = await Docente.findOne({documento: documento})

                    if(!docent){

                        bcrypt.hash(contraseña, 10, (err, contraseñaHasheada) => {
                            if(err) res.json(err)
                            
                            const docentes = new Docente(
                                {
                                    nombreCompleto: nombreCompleto,
                                    role: role,
                                    nacimiento: nacimiento,
                                    direccion: direccion,
                                    años_de_experiencia: años_de_experiencia,
                                    materias: materias,
                                    documento: documento,
                                    nivel_academico: nivel_academico,
                                    numero: numero,
                                    correo: correo,
                                    contraseña: contraseñaHasheada
                                }
                            )

                            docentes.save().then((user) => {
                                const token = jwt.sign({id: user._id, role: user.role}, process.env.secret, {
                                    expiresIn: 60 * 60 * 24
                                })

                                const {_id} = user
                                res.status(200).json({
                                    mensaje: 'Docente registrado',
                                    _id,
                                    token
                                })

                            })
                        })

                    }else{
                        res.status(404).json({
                            mensaje: 'Ya existe una cuenta con tu numero de documento'
                        })
                    }

                }else{
                    res.status(404).json({
                        mensaje: 'Ya exite una cuenta con tu correo'
                    })
                }
        }
    }else{
        const { nombreCompleto, role, nacimiento, documento, direccion, numero, correo, nivel_academico, años_de_experiencia, contraseña } = req.body;

        switch(true){
            case !nombreCompleto:
                res.status(400).json({
                    mensaje: 'El campo del Nombre completo es requerido'
                });
                break;
            case !role:
                res.status(400).json({
                    mensaje: 'El campo del Role es requerido'
                });
                break;
            case !nacimiento:
                res.status(400).json({
                    mensaje: 'El campo de la Fecha de nacimiento es requerida es requerido'
                });
                break;
            case !documento:
                res.status(400).json({
                    mensaje: 'El campo del Documentoh es requerido'
                });
                break;
            case !numero:
                res.status(400).json({
                    mensaje: 'El campo del Numero de telefono es requerido'
                });
                break;
            case !correo:
                res.status(400).json({
                    mensaje: 'El campo del Correo es requerido'
                });
                break;
            case !nivel_academico:
                res.status(400).json({
                    mensaje: 'El campo del Nivel academico es requerido'
                });
                break;
            case !años_de_experiencia:
                res.status(400).json({
                    mensaje: 'El campo de los Años de experiencia es requerido'
                });
                break;
            case !contraseña:
                res.status(400).json({
                    mensaje: 'El campo de la Contraseña es requerido'
                });
                break;

            default:

                const cordinador = await Docente.findOne({correo: correo})
                if(!cordinador){
                    const cordi = await Docente.findOne({documento: documento})

                    if(!cordi){

                        bcrypt.hash(contraseña, 10, (err, contraseñaHasheada) => {
                            if(err) res.json(err)
                            
                            const cordinadores = new Docente(
                                {
                                    nombreCompleto: nombreCompleto,
                                    role: role,
                                    nacimiento: nacimiento,
                                    direccion: direccion,
                                    años_de_experiencia: años_de_experiencia,
                                    documento: documento,
                                    nivel_academico: nivel_academico,
                                    numero: numero,
                                    correo: correo,
                                    contraseña: contraseñaHasheada
                                }
                            )

                            cordinadores.save().then((user) => {
                                const token = jwt.sign({id: user._id, role: user.role}, process.env.secret, {
                                    expiresIn: 60 * 60 * 24
                                })

                                const {_id} = user
                                res.status(200).json({
                                    mensaje: 'registrado',
                                    user,
                                    _id,
                                    token
                                })

                            })
                        })

                    }else{
                        res.status(404).json({
                            mensaje: 'Ya existe una cuenta con tu numero de documento'
                        })
                    }

                }else{
                    res.status(404).json({
                        mensaje: 'Ya exite una cuenta con tu correo'
                    })
                }
        }

    }


};

const login = (req, res) => {

    const {role} = req.body

    if(role == 'estudiante'){
        const { tipo_documento, documento, role, contraseña } = req.body
        switch(true){
            case !role:
                res.status(400).json({
                    mensaje: 'El campo del Role es requerido'
                })
                break;
            case !tipo_documento:
                res.status(400).json({
                    mensaje: 'El campo del Tipo de documento es requerido'
                })
                break;
            case !documento:
                res.status(400).json({
                    mensaje: 'El campo del Documento es requerido'
                })
                break;
            case documento.length < 8:
                res.status(400).json({
                    mensaje: 'Tu documento tiene que tener mas de 7 numero'
                })
                break;
            case documento.length > 10:
                res.status(400).json({
                    mensaje: 'Tu documento no puede tener mas de 10 numero'
                })
                break;
            case !contraseña:
                res.status(400).json({
                    mensaje: 'El campo de la Contraseña es requerido'
                })
                break;
    
            default:

                Usuario.findOne({documento: documento}).then((user) => {
                    if(user){
                        bcrypt.compare(contraseña, user.contraseña).then((ok) => {
                            if(ok){
                                const token = jwt.sign({id: user._id, role: user.role}, process.env.secret, {
                                    expiresIn: 60 * 60 * 24
                                });

                                res.status(200).json({
                                    mensaje: 'Usuario encontrado',
                                    user,
                                    token
                                })
                            }else{
                                res.status(404).json({
                                    mensaje: 'Contraseña incorrecta'
                                })
                            }
                        })
                    }else {
                        res.status(404).json({
                            mensaje: 'No exite ningun usuario con los datos ingresados'
                        })
                    }
                })
    
                break;
        }


    }else if(role == 'profesor'){
        const { documento, role, contraseña } = req.body

        switch(true){
            case !documento:
                res.status(400).json({
                    mensaje: 'El campo del Documento es requerido'
                })
                break;
            case !role:
                res.status(400).json({
                    mensaje: 'El campo del Role es requerido'
                })
                break
            case !contraseña:
                res.status(400).json({
                    mensaje: 'El campo de la Contraseña es requerido'
                })
                break;

            default:
                Docente.findOne({documento: documento}).then((user) => {
                    if(user){
                        bcrypt.compare(contraseña, user.contraseña).then((ok) => {
                            if(ok){

                                const token = jwt.sign({id: user._id, role: user.role}, process.env.secret, {
                                    expiresIn: 60 * 60 * 24
                                })

                                res.status(200).json({
                                    mensaje: 'Usuario encontrado',
                                    user,
                                    token
                                })
                            }else{
                                res.status(404).json({
                                    mensaje: 'Contraseña incorrecta'
                                })
                            }
                        })
                    }else {
                        res.status(404).json({
                            mensaje: 'No exite ningun usuario con los datos ingresados'
                        })
                    }
                })
                break;
        }

    }else{
        const { documento, role, contraseña } = req.body

        switch(true){
            case !documento:
                res.status(400).json({
                    mensaje: 'El campo del Documento es requerido'
                })
                break;
            case !role:
                res.status(400).json({
                    mensaje: 'El campo del Role es requerido'
                })
                break
            case !contraseña:
                res.status(400).json({
                    mensaje: 'El campo de la Contraseña es requerido'
                })
                break;

            default:
                Docente.findOne({documento: documento}).then((user) => {
                    if(user){
                        bcrypt.compare(contraseña, user.contraseña).then((ok) => {
                            if(ok){

                                const token = jwt.sign({id: user._id, role: user.role}, process.env.secret, {
                                    expiresIn: 60 * 60 * 24
                                })

                                res.status(200).json({
                                    mensaje: 'Usuario encontrado',
                                    user,
                                    token
                                })
                            }else{
                                res.status(404).json({
                                    mensaje: 'Contraseña incorrecta'
                                })
                            }
                        })
                    }else {
                        res.status(404).json({
                            mensaje: 'No exite ningun usuario con los datos ingresados'
                        })
                    }
                })
                break;
        }
    }


}

const perfil = (req, res) => {

    const role = req.userRole
    const id = req.userId
    console.log(role)

    if(role == 'estudiante'){

        if(!id){
            res.status(400).json({
                mensaje: 'Tu sección ha expirado'
            })
        }
    
        Usuario.findById(id).then((user) => {
            if(user){
                res.status(200).json({
                    mensaje: 'Usuario encotrado',
                    user
                })
            }else {
                res.status(404).json({
                    mensaje: 'Usuario no existe usuario'
                })
            }
    
        })

    }else{

        if(!id){
            res.status(400).json({
                mensaje: 'Tu sección ha expirado'
            })
        }

        Docente.findById(id).then((user) => {
            if(user){
                res.status(200).json({
                    mensaje: 'Usuario encontrado',
                    user
                })
            }else {
                res.status(404).json({
                    mensaje: 'Usuario no encontrado'
                })
            }
        })

    }

}

const cambiarContraseña = async(req, res) => {

    const { role } = req.body;

    if(role == 'estudiante'){
        const { role, correo } = req.body;
        Usuario.findOne({correo: correo}).then((user) => {
            if(!user){
                res.status(404).json({
                    mensaje: 'no existe usuario con el correo ingresado por favor matriculate'
                })
            }else{

                const token = jwt.sign({id: user._id, role: user.role}, process.env.secret, {
                    expiresIn: 60 * 60 * 24
                });

                transporter.sendMail({
    
                    from: '"Recuperar Contraseña" <adminApi>', // sender address
                    to: correo, // list of receivers
                    subject: "Recuperar Contraseña", // Subject line
                    html: `
                    <p>Por favor haz clic en el siguiente botón para restablecer tu contraseña:</p>
                    <button style="background-color: #008CBA; color: white; padding: 10px 20px; border: none; border-radius: 5px; text-decoration: none; font-size: 16px;">
                    <a href="http://127.0.0.1:5173/contrasenaCambiada/${user._id}" style="color: white; text-decoration: none;">Restablecer contraseña</a>
                    </button>
                    <br><br>
                    <img src="https://losmejorescolegios.com/wp-content/uploads/2022/05/cuadrada.jpg" style="width: 200px; heigth: 100px;" alt="Descripción de la imagen">
                        `
                });
    
                res.status(200).json({
                    mensaje: 'Revisa tu correo',
                    token
                })

            }


        })

    }else if(role == 'profesor'){
        const { correo } = req.body;

        Docente.findOne({correo: correo}).then((user) => {
            if(!user){
                res.status(404).json({
                    mensaje: 'no existe usuario con el correo ingresado por favor matriculate'
                })
            }else {

                const token = jwt.sign({id: user._id, role: user.role}, process.env.secret, {
                    expiresIn: 60 * 60 * 24
                });

                transporter.sendMail({
    
                    from: '"Recuperar Contraseña" <adminApi>', // sender address
                    to: correo, // list of receivers
                    subject: "Recuperar Contraseña", // Subject line
                    html: `
                    <p>Por favor haz clic en el siguiente botón para restablecer tu contraseña:</p>
                    <button style="background-color: #008CBA; color: white; padding: 10px 20px; border: none; border-radius: 5px; text-decoration: none; font-size: 16px;">
                    <a href="http://127.0.0.1:5173/contrasenaCambiada/${user._id}" style="color: white; text-decoration: none;">Restablecer contraseña</a>
                    </button>
                    <br><br>
                    <img src="https://pics.filmaffinity.com/kage_no_jitsuryokusha_ni_naritakute-583211422-mmed.jpg" alt="Descripción de la imagen">
                        `
                });
    
                res.status(200).json({
                    mensaje: 'Revisa tu correo',
                    token
                })

                
            }


        })

    }else {
        res.status(400).json({
            mensaje: 'Ingresa tu role'
        })
    }
}

const contraseñaCambiada = async(req, res) => {
    const { contraseña } = req.body

    const id = req.userId
    const role = req.userRole

    // console.log(id, role)

    try {

        if(role == 'estudiante'){
            const usuario = await Usuario.findById(id)

            if(!usuario) return res.status(404).json({ mensaje: 'El usuario no existe' });

            const hash = await bcrypt.hash(contraseña, 10);

            usuario.contraseña = hash;
            await usuario.save();

            res.status(200).json({
                mensaje: 'Contraseña actualizada por favor ingresa con tu nueva contraseña'
            })
        }else if(role == 'profesor'){

            const docente = await Docente.findById(id);

            if(!docente) return res.status(404).json({ mensaje: 'El usuario no existe' });

            const hash = await bcrypt.hash(contraseña, 10);

            docente.contraseña = hash;
            await docente.save();

            res.status(200).json({
                mensaje: 'Contraseña actualizada por favor ingresa con tu nueva contraseña'
            })
        }
        

    } catch (error) {
        res.status(404).json({
            error,
            id,
            role
        })
    }

}

module.exports = {
    register,
    login,
    perfil,
    cambiarContraseña,
    contraseñaCambiada
}