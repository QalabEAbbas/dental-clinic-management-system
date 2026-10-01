const express = require('express');

const {
    getAllDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor
} = require('../controllers/doctorController');

const router = express.Router();


// GET /api/doctors
router.get('/', getAllDoctors);


// GET /api/doctors/:id
router.get('/:id', getDoctorById);


// POST /api/doctors
router.post('/', createDoctor);


// PUT /api/doctors/:id
router.put('/:id', updateDoctor);


// DELETE /api/doctors/:id
router.delete('/:id', deleteDoctor);


module.exports = router;