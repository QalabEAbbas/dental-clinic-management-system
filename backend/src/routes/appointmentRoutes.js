const express = require('express');

const {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment
} = require('../controllers/appointmentController');

const router = express.Router();


// GET /api/appointments
router.get('/', getAllAppointments);


// GET /api/appointments/:id
router.get('/:id', getAppointmentById);


// POST /api/appointments
router.post('/', createAppointment);


// PUT /api/appointments/:id
router.put('/:id', updateAppointment);


// DELETE /api/appointments/:id
router.delete('/:id', deleteAppointment);


module.exports = router;