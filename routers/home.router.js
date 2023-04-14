const { Router } = require('express');
const { register, login, perfil, cambiarContraseña, contraseñaCambiada } = require('../controllers/home.controller');
const { listGrado } = require("../controllers/funcionesDelDocente");
const verificarToken = require('../controllers/verificarToken');
const { agregarPeriodo, agregarClase, periodos, clases, agregarDocenteAlaClase, crearSalon, agregarDirectorDelSalon, agregarEstudiantesAlSalon, traerEstudiantesDelSalon, estudiantes, fechaRegistro, matricular, rechazarAspirante, allDocentes, allSalones, crearGrado, crearAñoLetivo, letivos } = require('../controllers/funcionesDeLaSecretaria');

const router = Router();

router.post('/', register);
router.post('/login', login);
router.get('/user', verificarToken, perfil);
router.post('/cambiarContrasena', cambiarContraseña);
router.put('/update', verificarToken, contraseñaCambiada);
router.get('/grados', verificarToken, listGrado);
router.post('/agregarPeriodo', verificarToken, agregarPeriodo);
router.post('/agregarClase', verificarToken, agregarClase);
router.get('/periodos', verificarToken, periodos);
router.get('/clases/:id', verificarToken, clases);
router.post('/agregarDocente/:profesorId', verificarToken, agregarDocenteAlaClase);
router.post('/crearSalon', verificarToken, crearSalon);
router.put('/directorDeSalon/:profesorId', verificarToken, agregarDirectorDelSalon);
router.put('/agregarEstudianteSalon/:salonId', verificarToken, agregarEstudiantesAlSalon);
router.get('/estudiantesDelSalon/:salonId', verificarToken, traerEstudiantesDelSalon);
router.get('/estudiantes', verificarToken, estudiantes);
router.get('/fechaRegistro', verificarToken, fechaRegistro);
router.put('/matriculado', verificarToken, matricular);
router.delete('/rechazar', verificarToken, rechazarAspirante);
router.get('/docentes', verificarToken, allDocentes);
router.get('/salones', verificarToken, allSalones);
router.post('/crearGrado', verificarToken, crearGrado);
router.post('/letivo', verificarToken, crearAñoLetivo);
router.get('/letivosGet', verificarToken, letivos);
module.exports = router