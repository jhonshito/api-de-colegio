const mongoose = require('mongoose');

const { Schema } = mongoose;

// registro de estudiantes
const userSchema = new Schema({
    nombreCompleto : {
        type: String,
        required: true,
    },

    nacimiento : {
        type: String,
        required: String
    },

    tipo_documento : {
        type: String,
        required: true
    },

    documento: {
        type: String,
        unique: true,
        required: true
    },

    direccion: {
        type: String
    },

    numero: {
        type: String
    },

    correo : {
        type : String,
        unique : true
    },

    nombre_acudiente: {
        type: String,
        required: true
    },

    nivel_academico: {
        type: String,
        required: true
    },

    grado: {
        type: String,
        required: true,
    },

    numero_acudiente: {
        type: String,
        required: true
    },

    role: {
        type: String,
    },

    fechaRegistro: {
        type: Date,
        default: Date.now
    },

    matricula: {
        type: Boolean,
        default: false
    },
    
    contraseña: {
        type: String,
        required: true
    }
});


// registro de Docentes
const userProfesore = new Schema({
    nombreCompleto: {
        type: String,
        required: true
    },
    nacimiento: {
        type: String,
        required: true
    },
    documento: {
        type: String,
        required: true,
        unique: true
    },
    direccion: {
        type: String,
    },
    numero: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    nivel_academico: {
        type: String,
        required: true
    },
    materias: [],
    años_de_experiencia: {
        type: String,
        required: true
    },

    contraseña: {
        type: String,
        required: true
    }
});

const periodoSchema = new Schema({
    nombre : {
        type: String,
        required: true
    },

    inicio: {
        type: Date,
        required: true
    },

    fin:{
        type: Date,
        required: true
    },

    clases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'clases' }]
});

const clasesSchama = new Schema({
    nombre : {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true
    },
    profesor: {type: mongoose.Schema.Types.ObjectId, ref: 'docentes'}
});

const salonSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    descripcion: {
        type: String
    },
    director: {type: mongoose.Schema.Types.ObjectId, ref: 'docentes'},
    estudiantes: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}]
})

const gradoSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    director_de_grupo: {type: mongoose.Schema.Types.ObjectId, ref: 'docentes'},
    estudiantes: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}]
})

const añoLetivoSchama = new Schema({
    nombre: {
        type: String,
        required: true
    },
    jornada: {
        type: String,
        required: true
    },
    inicio: {
        type: Date,
        required: true
    },
    fin: {
        type: Date,
        required: true
    },

    periodos: [{type: mongoose.Schema.Types.ObjectId, ref: 'periodos'}],
    estudiantes: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    materias: [{type: mongoose.Schema.Types.ObjectId, ref: 'materias'}],
    asignaturas: [{type: mongoose.Schema.Types.ObjectId, ref: 'asignaturas'}]
})

const materiasSchema = new Schema({
    nombre: {
        type: String,
    },
    descripcion: {
        type: String
    }
})

const asignaturasSchema = new Schema({
    nombre: {
        type: String
    },
    descripcion: {
        type: String
    },
    materias: {
        type: Array
    }
})

const Materia = mongoose.model('materias', materiasSchema);
const Asignatura = mongoose.model('asignaturas', asignaturasSchema);

const Usuario = mongoose.model('users', userSchema);
const Docente = mongoose.model('docentes', userProfesore);
const Periodo = mongoose.model('periodos', periodoSchema);
const Clase = mongoose.model('clases', clasesSchama);
const Salon = mongoose.model('salones', salonSchema);
const Grado = mongoose.model('grados', gradoSchema);
const Letivo = mongoose.model('letivos', añoLetivoSchama);

module.exports = {
    Usuario,
    Docente,
    Periodo,
    Clase,
    Salon,
    Grado,
    Letivo,
    Materia,
    Asignatura
}