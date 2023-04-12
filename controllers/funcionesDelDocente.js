const { Docente, Usuario } = require("../models/models")


const listGrado = (req, res) => {
    const { grado } = req.body
    const role = req.userRole
    const id = req.userId

    if(role !== 'estudiante'){
        Docente.findById(id).then((user) => {
            if(user){
                Usuario.find({ grado: grado }).then((users) => {
                    if(users.length > 0){
                        res.status(200).json({
                            mensaje: 'estudiantes del grado ' + grado,
                            users
                        })
                    }else {
                        res.status(404).json({
                            mensaje: 'No existe estudiantes del grado ' + grado
                        })
                    }
                })
            }else {
                res.status(404).json({
                    mensaje: 'No existe usuario'
                })
            }
        })
        .catch((e) => res.status(404).json(e))
    }else {
        res.status(404).json({
            mensaje: 'No puedes acceder a esta funcion '
        })
    }
};

module.exports = {
    listGrado
}