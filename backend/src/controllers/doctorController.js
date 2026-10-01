const doctorService = require('../services/doctorService');


// GET /api/doctors
const getAllDoctors = async (req, res, next) => {
    try {
        const { search = '' } = req.query;

        const doctors = await doctorService.getAllDoctors(search);

        res.status(200).json({
            success: true,
            message: 'Doctors retrieved successfully',
            data: doctors
        });
    } catch (error) {
        next(error);
    }
};


// GET /api/doctors/:id
const getDoctorById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Doctor ID must be a positive integer'
            });
        }

        const doctor = await doctorService.getDoctorById(id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Doctor retrieved successfully',
            data: doctor
        });
    } catch (error) {
        next(error);
    }
};


// POST /api/doctors
const createDoctor = async (req, res, next) => {
    try {
        const {
            name,
            specialization,
            phone,
            email,
            availability,
            is_active = true
        } = req.body;

        // Required field validation
        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Doctor name is required'
            });
        }

        if (!specialization || !specialization.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Specialization is required'
            });
        }

        // Email validation
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide a valid email address'
                });
            }
        }

        const doctor = await doctorService.createDoctor({
            name: name.trim(),
            specialization: specialization.trim(),
            phone: phone?.trim() || null,
            email: email?.trim() || null,
            availability: availability?.trim() || null,
            is_active: Boolean(is_active)
        });

        res.status(201).json({
            success: true,
            message: 'Doctor created successfully',
            data: doctor
        });
    } catch (error) {
        // Duplicate email
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'A doctor with this email already exists'
            });
        }

        next(error);
    }
};


// PUT /api/doctors/:id
const updateDoctor = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Doctor ID must be a positive integer'
            });
        }

        const {
            name,
            specialization,
            phone,
            email,
            availability,
            is_active
        } = req.body;

        // Required field validation
        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Doctor name is required'
            });
        }

        if (!specialization || !specialization.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Specialization is required'
            });
        }

        // Email validation
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide a valid email address'
                });
            }
        }

        // Check if doctor exists
        const existingDoctor = await doctorService.getDoctorById(id);

        if (!existingDoctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        const doctor = await doctorService.updateDoctor(id, {
            name: name.trim(),
            specialization: specialization.trim(),
            phone: phone?.trim() || null,
            email: email?.trim() || null,
            availability: availability?.trim() || null,
            is_active: Boolean(is_active)
        });

        res.status(200).json({
            success: true,
            message: 'Doctor updated successfully',
            data: doctor
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'A doctor with this email already exists'
            });
        }

        next(error);
    }
};


// DELETE /api/doctors/:id
const deleteDoctor = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Doctor ID must be a positive integer'
            });
        }

        const existingDoctor = await doctorService.getDoctorById(id);

        if (!existingDoctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        await doctorService.deleteDoctor(id);

        res.status(200).json({
            success: true,
            message: 'Doctor deleted successfully'
        });
    } catch (error) {
        // Doctor has appointments
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                success: false,
                message: 'Cannot delete this doctor because they have existing appointments'
            });
        }

        next(error);
    }
};


module.exports = {
    getAllDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor
};