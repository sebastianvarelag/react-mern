
// Todas tienen que pasar por la validación

const { Router } = require('express');
const { check } = require('express-validator');

const { fieldsValidate } = require('../middlewares/field-validators')
const { isDate } = require('../helpers/isDate');
const { validateJWT } = require('../middlewares/token-validator')
const { getEventos, createEvent, updateEvent, deleteEvent } = require("../controllers/events");

const router = Router();

// Todas las peticiones tienen que pasar por esta validación middleware

router.use(validateJWT);

// Obtener eventos
router.get('/', getEventos);

// Crear un nuevo evento
router.post('/create', [
  check('title', 'The title is required').not().isEmpty(),
  check('start', 'The start date is required').custom(isDate),
  check('end', 'The end date is required').custom(isDate),
  fieldsValidate
], createEvent);

// // Actualizar evento
router.put('/:id', updateEvent);

// // Borrar evento
router.delete('/:id', deleteEvent);

module.exports = router;