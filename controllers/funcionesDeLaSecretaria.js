const { Periodo, Clase, Salon, Docente, Usuario, Grado, Letivo, Materia, Asignatura } = require('../models/models');
const transporter = require("../config/mailer")
const moment = require('moment');

// crear periodo
const agregarPeriodo = (req, res) => {
    const { nombre, inicio, fin, idLetivo } = req.body;

    const role = req.userRole

    const fechaInicio = moment(inicio, 'YYYY-MM-DD').toDate();
    const fechaFin = moment(fin, 'YYYY-MM-DD').toDate(); 
    console.log(idLetivo)
    if(role !== 'estudiante'){

        Letivo.findById(idLetivo).then((letivo) => {
            if(letivo){

                const periodo = new Periodo({nombre: nombre, inicio: fechaInicio, fin: fechaFin});
                periodo.save().then((periodos) => {
                    if(periodos){
                        letivo.periodos.push(periodos._id)
                        letivo.save().then(() => {
                            res.status(200).json({
                                mensaje: 'Periodo agregado',
                                periodos
                            })
                        })
                    }else {
                        res.status(404).json({
                            mensaje: 'no se pudo agregar el periodo '
                        })
                    }
                })
                .catch((e) => res.json(e))

            }else {
                res.status(404).json({
                    status: 400,
                    mensaje: 'No exites el año lectivo seleccionado'
                })
            }
        })
        .catch((e) => {
            res.status(500).json({
                status: 500,
                mensaje: 'Error al buscar el año letivo',
                e
            })
        })

    }else {
        res.status(400).json({
            mensaje: 'No puedes acceder a esta funcion'
        })
    }

    
};

const agregarClase = (req, res) => {

    const { nombre, descripcion, id} = req.body
    const role = req.userRole

    if(role !== 'estudiante'){
        const clase = new Clase({nombre: nombre, descripcion: descripcion});
        
        clase.save().then((clase) => {
            if(clase){

                Periodo.findById(id).then((periodo) => {
                    if(periodo){
                        periodo.clases.push(clase._id);
                        periodo.save().then((period) => {
                            if(period){
                                res.status(200).json({
                                    mensaje: 'Clase agregada exitosamente',
                                    clase,
                                    period
                                })
                            }else {
                                res.status(404).json({
                                    mensaje: 'No se pudo agregar la clase al periodo'
                                })
                            }
                        })
        
                    }else{
                        res.status(400).json({
                            mensaje: 'No existe el periodo'
                        })
                    }
                })
                .catch((e) => res.json(e))

            }
        })
        .catch((e) => res.json(e))
    }else {
        res.status(400).json({
            mensaje: 'No puedes acceder a esta funcion'
        })
    }
};

// traer periodos
const periodos = (req, res) => {
    const role = req.userRole

    if(role !== 'estudiante'){

        Periodo.find().then((periodos) => {
            if(periodos){
                res.status(200).json({
                    mensaje: 'Todos los periodos',
                    periodos
                })
            }else{
                res.status(400).json({
                    mensaje: 'No hay periodos vigibles'
                })
            }
        })
        .catch((e) => res.json(e));

    }else {
        res.status(400).json({
            mensaje: 'No puedes acceder a esta funcion'
        })
    }
};

// traer todos los clases del periodo seleccionado
const clases = (req, res) => {
    const {id} = req.params
    const role = req.userRole

    if (role !== 'estudiante') {
        Periodo.findById(id)
            .populate({
                path: 'clases',
                populate: {
                    path: 'profesor',
                }
            })
            .then((periodo) => {
                if (periodo) {
                    res.status(200).json({
                        mensaje: 'Clases del periodo obtenidas exitosamente',
                        clases: periodo.clases
                    });
                } else {
                    res.status(404).json({
                        mensaje: 'No se encontró el período con el ID especificado'
                    });
                }
            })
            .catch((e) => {
                res.status(500).json({
                    mensaje: 'Error al obtener las clases del período',
                    error: e
                });
            });
    } else {
        res.status(400).json({
            mensaje: 'No puedes acceder a esta función'
        });
    }
};

const agregarDocenteAlaClase = (req, res) => {

    const { id } = req.body
    const profesorId = req.params.profesorId;
    const role = req.userRole

    if(role !== 'estudiante'){
        Clase.findById(id).then((clase) => {
            if(clase){
                clase.profesor = profesorId
                clase.save().then((nuevaClase) => {
                    res.status(200).json({
                        mensaje: 'Profesor agregado exitosamente a la clase',
                        clase: nuevaClase
                    });
                })
                .catch((e) => {
                    res.status(500).json({
                        mensaje: 'Error al obtener la clase',
                        error: e
                    });
                })
            }else {
                res.status(404).json({
                    mensaje: 'No existe ninguna clase con ese id'
                })
            }
        })
    }else {
        res.status(500).json({
            mensaje: 'No puedes acceder a esta funcion'
        })
    }
};

// crear salones de clase y agregarle un director de grupo
const crearSalon = (req, res) => {

    const { nombre, descripcion, id } = req.body
    const role = req.userRole;

    if(role == 'secretaria'){

        Docente.findById(id).then((usuario) => {
            if(usuario){

                const salones = new Salon({nombre: nombre, descripcion: descripcion, director: usuario._id});
                salones.save().then((salon) => {
                    if(salon){
                        res.status(200).json({
                            mensaje: 'Salon creado',
                            salon
                        })
                    }else {
                        res.status(404).json({
                            mensaje: 'salon no creado'
                        })
                    }
                })
                .catch((e) => {
                    res.status(500).json({
                        mensaje: 'Error al crear el salon',
                        error: e
                    });
                });

            }else {
                res.status(404).json({
                    status: 404,
                    mensaje: 'No existe el usuario con es id'
                })
            }
        })
        .catch((e) => {
            res.status(500).json({
                status: 500,
                mensaje: 'Error al buscar al usuario'
            })
        })


    }else {
        res.status(400).json({
            mensaje: 'No puedes acceder a esta funcion'
        })
    }

};

const agregarDirectorDelSalon = (req, res) => {

    const {salonId} = req.body
    const role = req.userRole
    const id = req.params.profesorId

    if(role !== 'estudiante'){
        Docente.findById(id).then((profesor) => {
            if(profesor){
                Salon.findById(salonId).then((salon) => {
                    if(salon){
                        salon.director = profesor._id
                        salon.save().then(() => {
                            res.status(200).json({
                                mensaje: 'Director de salon asignado',
                                profesor,
                                salon
                            })
                        })
                        .catch((e) => {
                            res.status(500).json({
                                mensaje: 'Fallo al signar al director del salon',
                                e
                            })
                        })
                    }else {
                        res.status(404).json({
                            mensaje: 'No existe el salon'
                        })
                    }
                })
            }else {
                res.status(404).json({
                    mensaje: 'No exite el usuario'
                })
            }
        })
        .catch((e) => {
            res.status(500).json({
                mensaje: 'Error al buscar al Docente',
                error: e
            });
        })
    }else {
        res.status(400).json({
            mensaje: 'No puedes acceder a esta funcion'
        })
    }
};

// agregar el postman ⬇⬇ y el router que faltan
const agregarEstudiantesAlSalon = (req, res) => {

    const role = req.userRole
    const salonId = req.params.salonId
    const {userId} = req.body

    if(role !== 'estudiante'){

        Usuario.findById(userId).then((user) => {
            if(user){
                Salon.findById(salonId).then((salon) => {
                    if(salon){
                        salon.estudiantes.push(user._id)
                        salon.save().then(() => {
                            res.status(200).json({
                                mensaje: 'Estudiante agregado exitosamente',
                                salon,
                                user
                            })
                            .catch((e) => {
                                res.status(500).json({
                                    mensaje: 'Fallo al asignar al estudiante'
                                })
                            })
                        })
                    }else {
                        res.status(404).json({
                            mensaje: 'No existe le salon'
                        })
                    }
                })
                .catch((e) => {
                    res.status(500).json({
                        mensaje: 'Error al buscar el salon'
                    })
                })
            }else {
                res.status(404).json({
                    mensaje: 'No existe el usuario'
                })
            }
        })
        .catch((e) => {
            res.status(500).json({
                mensaje: 'Error al buscar al estudiante'
            })
        })
    }else {
        res.status(400).json({
            mensaje: 'No puedes acceder a esta funcion'
        })
    }
};

const traerEstudiantesDelSalon = (req, res) => {

    const role = req.userRole
    const salonId = req.params.salonId

    if(role !== 'estudiante'){
        Salon.findById(salonId).populate('estudiantes').then((estudiantes) => {
            if(estudiantes.estudiantes.length > 0){

                res.status(200).json({
                    mensaje: 'Estudiantes del salon',
                    estudiantes: estudiantes.estudiantes
                })
            }else {
                res.status(404).json({
                    mensaje: 'No hay estudiantes en este salon'
                })
            }
        })
    }else {
        res.status(500).json({
            mensaje: 'No puedes acceder a esta funcion'
        })
    }

};

// traer a todos los estudiantes
const estudiantes = (req, res) => {
    const role = req.userRole

    if(role == 'secretaria'){

        Usuario.find({ matricula: true }).sort({$natural:-1}).then((user) => {

            if(user){
                res.status(200).json({
                    mensaje: 'Estudiantes',
                    user
                })
            }else {
                res.status(404).json({
                    mensaje: 'No existen usuarios actualmente'
                })
            }

        })
        .catch((e) => {
            res.status(500).json({
                mensaje: 'Erro al traer los datos',
                e
            })
        })
    }else {
        res.status(500).json({
            mensaje: 'No puedes acceder a esta funcion'
        })
    }
}

// traer a los aspirantes a matricula
const fechaRegistro = (req, res) => {
    const role = req.userRole

    if(role == 'secretaria'){

        const hoy = new Date()
        // const haceSieteDias = new Date(hoy.getTime() - (7 * 24 * 60 * 60 * 1000))

        Usuario.find({ matricula: false }).sort({$natural:-1}).then((user) => { // Agregar condición de búsqueda y sort() aquí

            if(user){
                res.status(200).json({
                    mensaje: 'Estudiantes',
                    user
                })
            }else {
                res.status(404).json({
                    mensaje: 'No existen usuarios actualmente'
                })
            }

        })
        .catch((e) => {
            res.status(500).json({
                mensaje: 'Erro al traer los datos',
                e
            })
        })
    }else {
        res.status(500).json({
            mensaje: 'No puedes acceder a esta funcion'
        })
    }
}

// matricular al aspirante a estudiante y enviarle el correo de confimacion de la matricula
const matricular = (req, res) => {

    const { texto, id, idLetivo } = req.body
    const role = req.userRole

    if(role == 'secretaria'){
        Usuario.findById(id).then((user) => {
            if(user){

                user.matricula = true
                user.save().then(() => {
                    Letivo.findById(idLetivo).then((letivo) => {
                        if(letivo){
                            letivo.estudiantes.push(user._id)
                            letivo.save().then((añosLetivos) => {
                                if(añosLetivos){
                                    transporter.sendMail({
                                        from: '"MATRICULA" <Secretaria>', // sender address
                                        to: user.correo, // list of receivers
                                        subject: "HASIDO MATRICULADO EN NUESTRA AULA", // Subject line
                                        html: `
                                        <p>${texto}:</p>
                                        <br><br>
                                        <img src="https://losmejorescolegios.com/wp-content/uploads/2022/05/cuadrada.jpg" style="width: 200px; heigth: 100px;" alt="Descripción de la imagen">
                                          `
                                    });
                
                                    res.status(200).json({
                                        status: 200,
                                        mensaje: 'email de confirmacion enviado'
                                    })
                                }else {
                                    res.status(404).json({
                                        status: 404,
                                        mensaje: 'No se pudo guardar'
                                    })
                                }
                            })
                        }else {
                            res.status(404).json({
                                status: 404,
                                mensaje: 'No se encontro los año letivo seleccionado'
                            })
                        }
                    })
                    .catch((e) => {
                        res.status(500).json({
                            status: 500,
                            mensaje: 'Error al buscar el año letivo',
                            e
                        })
                    })
                })
                .catch((e) => {
                    res.status(500).json({
                        status: 500,
                        mensaje: 'Error al guardar los cambios del aspirante'
                    })
                })

            }else {
                res.status(404).json({
                    error: 404,
                    mensaje: 'No existe usuario registrado'
                })
            }
        })
        .catch((e) => {
            res.status(500).json({
                error: 500,
                mensaje: 'Error al buscar el usuario'
            })
        })
    }
}

// rechazar aspirante a matricula
const rechazarAspirante = (req, res) => {

    const {id, texto} = req.body
    const role = req.userRole 

    if(role == 'secretaria'){
        Usuario.findByIdAndDelete(id).then((ok) => {
            if(ok){

                if(ok.matricula == false){

                    transporter.sendMail({
                        from: '"MATRICULA DENEGADA" <Secretaria>', // sender address
                        to: ok.correo, // list of receivers
                        subject: " TU MATRICULADO HASIDO DENEGADA", // Subject line
                        html: `
                        <p>${texto}:</p>
                        <br><br>
                        <img src="https://losmejorescolegios.com/wp-content/uploads/2022/05/cuadrada.jpg" style="width: 200px; heigth: 100px;" alt="Descripción de la imagen">
                          `
                    });
    
                    res.status(200).json({
                        status: 200,
                        mensaje: 'Aspirante rechazado exitosamnete'
                    })

                }else {
                    res.status(400).json({
                        status: 400,
                        mensaje: 'No se puede eliminar este usuario porque ya esta matriculado'
                    })
                }


            }else {
                res.status(404).json({
                    status: 500,
                    mensaje: 'No se pudo eliminar al aspirante'
                })
            }
        })
        .catch((e) => {
            res.status(500).json({
                status: 500,
                mensaje: 'Error al buscar al aspirante',
                e
            })
        })
    }else {
        res.status(400).json({
            status: 400,
            mensaje: 'No puedes acceder a esta funcion'
        })
    }
}

// traer a todos los docentes
const allDocentes = (req, res) => {
    const role = req.userRole

    if(role == 'secretaria'){
        Docente.find({role: 'profesor'}).populate('materias').populate('asignatura').then((usuarios) => {
            if(usuarios){
                res.status(200).json({
                    status: 200,
                    mensaje: 'Usuarios encontrados',
                    usuarios
                })
            }else {
                res.status(404).json({
                    status: 404,
                    mensaje: 'No hay docentes registrados'
                })
            }
        })
        .catch((e) => {
            res.status(500).json({
                status: 500,
                mensaje: 'Error al buscar a los docentes',
                e
            })
        })
    }else {
        res.status(400).json({
            status: 400,
            mensaje: 'no puedes acceder a esta funcion'
        })
    }
}

// traer todos los salones
const allSalones = (req, res) => {

    const role = req.userRole

    if(role == 'secretaria'){
        Salon.find().populate('director').then((datos) => {

            if(datos){
                res.status(200).json({
                    status: 200,
                    mensaje: 'salones',
                    datos
                })
            }else {
                res.status(404).json({
                    status: 404,
                    mensaje: 'No hay salones'
                })
            }
        })
        .catch((e) => {
            res.status(500).json({
                status: 500,
                mensaje: 'Error al buscar los salones',
                e
            })
        })
    }else {
        res.status(400).json({
            status: 400,
            mensaje: 'No puedes acceder a esta funcion'
        })
    }
}

// crear grado
const crearGrado = async(req, res) => {

    const { nombre, director_de_grupo, estudiantes } = req.body

    const role = req.userRole

    if(role == 'secretaria'){

        const itemGrado =  await Grado.findOne({ nombre: nombre })
        if(itemGrado){
           return res.status(400).json({
                status: 400,
                mensaje: 'Ya existe grado con este nombre'
            })
        }
        const nuevoGrado = new Grado({
            nombre: nombre,
            director_de_grupo: director_de_grupo,
            estudiantes: estudiantes
        })

        nuevoGrado.save().then((grado) => {
            if(!grado) {
                // console.log(err)
                res.status(500).json({
                    status: 500,
                    mensaje: 'Ha ocurrido un error al guardar el grado en la base de datos'
                })
            } else {
                res.status(200).json({
                    status: 200,
                    mensaje: 'Grado guardado correctamente en la base de datos',
                    grado: grado
                })
            }
        })
        .catch((e) => {
            // console.log(e);
            res.status(500).json({
              status: 500,
              mensaje: 'Error al crear el grado',
              e
            })
        })

    } else {
        res.status(400).json({
            status: 400,
            mensaje: 'No puedes acceder a esta funcion'
        })
    }
}

// traer a todos los grados
const allGrados = (req, res) => {

    const role = req.userRole
    if(role == 'secretaria'){
        Grado.find().populate('director_de_grupo').populate('estudiantes').then((grados) => {
            if(grados){
                res.status(200).json({
                    status: 200,
                    mensaje: 'Grados encontrados',
                    grados
                })
            }else {
                res.status(404).json({
                    status: 404,
                    mensaje: 'No hay grados actualmente'
                })
            }
        })
        .catch((e) => {
            res.status(500).json({
                status: 500,
                mensaje: 'Error al traer todos los grados',
                e
            })
        })
    }else {
        res.status(400).json({
            status: 400,
            mensaje: 'No puedes acceder a esta función'
        })
    }
}

// crear año letivo
const crearAñoLetivo = (req, res) => {

    const { nombre, inicio, fin, jornada } = req.body
    const role = req.userRole

    if(role == 'secretaria'){

        const añoLetivo = new Letivo({
            nombre: nombre,
            inicio: inicio,
            fin: fin,
            jornada: jornada
        })

        añoLetivo.save().then((letivo) => {
            if(letivo){
                res.status(200).json({
                    status: 200,
                    mensaje: 'año letivo creado exitosamente',
                    letivo
                })
            }else {
                res.status(404).json({
                    status: 404,
                    mensaje: 'No se pudo crear el año letivo'
                })
            }
        })
        .catch((e) => {
            res.status(500).json({
                status: 500,
                mensaje: 'Error al crear el año letivo',
                e
            })
        })

    }else {
        res.status(400).json({
            status: 400,
            mensaje: 'No puedes acceder a esta funcion'
        })
    }
}

// crear materias y agregarlas al año letivo seleccionado
const crearMaterias = (req, res) => {

    const { nombre, idLetivo, tipo } = req.body
    const role = req.userRole
    if(role == 'secretaria'){

        switch(true){
            case !nombre:
                res.status(400).json({
                    status: 400,
                    mensaje: 'El nombre es requerido'
                })
                break;
            case !idLetivo:
                res.status(400).json({
                    status: 400,
                    mensaje: 'el campo del es requerida'
                })
                break;

            default:

                const datos = new Materia({nombre: nombre, tipo: tipo});

                datos.save().then((materia) => {
                    if(materia){

                        Letivo.findById(idLetivo).then((letivo) => {
                            if(letivo){
                                letivo.materias.push(materia._id)
                                letivo.save().then((isOk) => {
                                    if(isOk){
                                        res.status(200).json({
                                            status: 200,
                                            mensaje: 'Materia creada y agregada al año letivo seleccionado',
                                            materia: materia
                                        })
                                    }else {
                                        res.status(404).json({
                                            status: 404,
                                            mensaje: 'No se agrego la materia al año letivo'
                                        })
                                    }
                                })
                                .catch((e) => {
                                    res.status(500).json({
                                        status: 500,
                                        mensaje: 'Error al agregar la materia al año letivo',
                                        e
                                    })
                                })
                            }else {
                                res.status(404).json({
                                    status: 404,
                                    mensaje: 'No se puedo encontrar el año letivo seleccionado'
                                })
                            }
                        })
                        .catch((e) => {
                            res.status(500).json({
                                status: 500,
                                mensaje: 'Error al buscar el año letivo seleccionado',
                                e
                            })
                        })

                    }else {
                        res.status(404).json({
                            status: 404,
                            mensaje: 'No se pudo crear la materia'
                        })
                    }
                })
                .catch((e) => {
                    res.status(500).json({
                        status: 500,
                        mensaje: 'Error al guardar los datos',
                        e
                    })
                })
                
                break;
        }

    }else {
        res.status(400).json({
            status: 400,
            mensaje: 'No puedes acceder a esta funcion'
        })
    }
}

// crear asignaturas
const crearAsignaturas = (req, res) => {

    const { nombre, materias, idLetivo, tipo } = req.body 
    const role = req.userRole
    if(role == 'secretaria'){

        switch(true){
            case !nombre:
                res.status(400).json({
                    status: 400,
                    mensaje: 'El campo del nombre es requerido'
                })
                break
            case materias.length == 0:
                res.status(400).json({
                    status: 400,
                    mensaje: 'El campo de las materias es requerido'
                })
                break

            default:

                const datos = new Asignatura({nombre: nombre, materias: materias, tipo: tipo})

                datos.save().then((data) => {
                    if(data){

                        Letivo.findById(idLetivo).then((letivo) => {
                            if(letivo){
                                letivo.asignaturas.push(data._id)
                                letivo.save().then((isOk) => {
                                    if(isOk){
                                        res.status(200).json({
                                            status: 200,
                                            mensaje: 'Asignatura creada y agregada al año letivo seleccionado',
                                            asignaturas: data
                                        })
                                    }else {
                                        res.status(404).json({
                                            status: 404,
                                            mensaje: 'No se pudo agregar la asignatura al año letivo seleccionado'
                                        })
                                    }
                                })
                                .catch((e) => {
                                    res.status(500).json({
                                        status: 500,
                                        mensaje : 'Error al guardar los cambios del año letivo',
                                        e
                                    })
                                })
                            }else {
                                res.status(404).json({
                                    status: 404,
                                    mensaje: 'No se pudo encontrar el año letivo seleccionado'
                                })
                            }
                        })
                        .catch((e) => {
                            res.status(500).json({
                                status: 500,
                                mensaje: 'Error al buscar el año letivo seleccionado',
                                e
                            })
                        })

                    }else {
                        res.status(404).json({
                            status: 404,
                            mensaje: 'No se pudo crear la asignatura'
                        })
                    }
                })
                .catch((e) => {
                    res.status(500).json({
                        status: 500,
                        mensaje: 'Error al crear la nueva asignatura',
                        e
                    })
                })
                break;
        }
    }else {
        res.status(400).json({
            status: 400,
            mensaje: 'No puedes acceder a esta función'
        })
    }
}

// traer años letivos
const letivos = (req, res) => {

    const role = req.userRole

    if(role == 'secretaria'){

        Letivo.find().populate('periodos').then((letivos) => {
            if(letivos){
                res.status(200).json({
                    status: 200,
                    mensaje: 'Años letivos',
                    años_letivos: letivos
                })
            }else {
                res.status(400).json({
                    status: 400,
                    mensaje: 'No hay años letivos actualmente'
                })
            }
        })

    }else {
        res.status(400).json({
            status: 400,
            mensaje: 'No puedes acceder a esta funcion'
        })
    }
}

// traer a todos lo periodos del año letivo seleccionado
const periodosDeLosAñosLetivos = (req, res) => {
    const { idLetivo } = req.params
    const role = req.userRole

    if(role == 'secretaria'){

        Letivo.findById(idLetivo).populate('periodos').then((letivo) => {
            if(letivo){
                res.status(200).json({
                    status: 200,
                    mensaje: 'periodos',
                    periodos: letivo.periodos
                })
            }else {
                res.status(404).json({
                    status: 404,
                    mensaje: 'No existe año letivo que seleccionaste'
                })
            }
        })
        .catch((e) => {
            res.status(500).json({
                status: 500,
                mensaje: 'Error al buscar el año letivo',
                e
            })
        })

    }else {
        res.status(400).json({
            status: 400,
            mensaje: 'No puedes acceder a esta funcion'
        })
    }
}

// traer todas las materias creadas
const materiasCreadas = (req, res) => {

    const role = req.userRole
    if(role == 'secretaria'){

        Materia.find().then((materias) => {
            if(materias){
                res.status(200).json({
                    status: 200,
                    mensaje: 'materias',
                    materias
                })
            }else {
                res.status(404).json({
                    status: 404,
                    mensaje: 'No hay materias creadas'
                })
            }
        })
        .catch((e) => {
            res.status(500).json({
                status: 500,
                mensaje: 'Error la buscar las materias creadas',
                e
            })
        })

    }else {
        res.status(400).json({
            status: 400,
            mensaje: 'No puedes acceder a esta funcion'
        })
    }
}

// traer todas la asignaturas
const asignaturasCreadas = (req, res) => {

    const role = req.userRole
    if(role == 'secretaria'){

        Asignatura.find().then((data) => {
            if(data){
                res.status(200).json({
                    status: 200,
                    mensaje: 'asignaturas', 
                    asignaturas: data
                })
            }else {
                res.status(404).json({
                    status: 404,
                    mensaje: 'No hay asignaturas creadas'
                })
            }
        })
        .catch((e) => {
            res.status(500).json({
                status: 500,
                mensaje: 'Error al buscar las asignaturas creadas',
                e
            })
        })

    }else {
        res.status(400).json({
            status: 400,
            mensaje: 'No puedes acceder a esta funcion'
        })
    }
}

// agregar materia a los profesores
const addMateria = (req, res) => {
    const { docenteId, materiaId } = req.body
    const role = req.userRole

    if(role == 'secretaria'){
        Docente.findById(docenteId).then((docente) => {
            if(docente){
                docente.materias = materiaId
                docente.save().then((isOk) => {
                    if(isOk){
                        res.status(200).json({
                            status: 200,
                            mensaje: 'Materia agregada'
                        })
                    }else {
                        res.status(404).json({
                            status: 404,
                            mensaje: 'No se pudo agregar la materia o la asignatura'
                        })
                    }
                })
                .catch((e) => {
                    res.status(500).json({
                        status: 500,
                        mensaje: 'Fallo al agregar la materia o la asignatura al docente',
                        e
                    })
                })
            }else {
                res.status(404).json({
                    status: 404,
                    mensaje: 'No existe el docente que seleccionaste'
                })
            }
        })
        .catch((e) => {
            res.status(500).json({
                status: 500,
                mensaje: 'Error al buscar al docente seleccionado',
                e
            })
        })
    }else {
        res.status(400).json({
            status: 400,
            mensaje: 'No puedes acceder a esta función'
        })
    }
}

// agregar asignatura a los profesores
const addAsignatura = (req, res) => {

    const { docenteId, asignaturaId } = req.body

    const role = req.userRole
    if(role == 'secretaria'){

        Docente.findById(docenteId).then((docente) => {
            if(docente){
                Asignatura.findById(asignaturaId).then((asignatura) => {
                    if(asignatura){
                        docente.asignatura = asignatura._id
                        docente.save().then((isOk) => {
                            if(isOk){
                                res.status(200).json({
                                    status: 200,
                                    mensaje: 'Asignatura agregada exitosamente'
                                })
                            }else {
                                res.status(404).json({
                                    status: 404,
                                    mensaje: 'No se pudo asignale la asignatura al docente seleccionado'
                                })
                            }
                        })
                        .catch((e) => {
                            res.status(500).json({
                                status: 500,
                                mensaje: 'Error al guardar los datos de la asignatura',
                                e
                            })
                        })
                    }else {
                        res.status(404).json({
                            status: 404,
                            mensaje: 'La asignatura seleccionada no existe'
                        })
                    }
                })
                .catch((e) => {
                    res.status(500).json({
                        status: 500,
                        mensaje: 'Error al buscar la asgnatura',
                        e
                    })
                })
            }else {
                res.status(404).json({
                    status: 404,
                    mensaje: 'El docente seleccionado no existe'
                })
            }
        })
        .catch((e) => {
            res.status(500).json({
                status: 500,
                mensaje: 'Error al buscar al docente',
                e
            })
        })

    }else {
        res.status(400).json({
            status: 400,
            mensaje: 'No puedes acceder a esta función'
        })
    }
}

module.exports = {
    agregarPeriodo,
    agregarClase,
    periodos,
    clases,
    agregarDocenteAlaClase,
    crearSalon,
    agregarDirectorDelSalon,
    agregarEstudiantesAlSalon,
    traerEstudiantesDelSalon,
    estudiantes,
    fechaRegistro,
    matricular,
    rechazarAspirante,
    allDocentes,
    allSalones,
    crearGrado,
    crearAñoLetivo,
    letivos,
    periodosDeLosAñosLetivos,
    crearMaterias,
    crearAsignaturas,
    materiasCreadas,
    asignaturasCreadas,
    addMateria,
    allGrados,
    addAsignatura
}