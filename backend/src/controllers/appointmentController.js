const appointmentService = require('../services/appointmentService');

const validStatuses = [
    'pending',
    'confirmed',
    'completed',
    'cancelled'
];


// GET /api/appointments
const getAllAppointments = async (req, res, next) => {
    try {
        const {
            status,
            doctor_id,
            date
        } = req.query;

        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Allowed values: ${validStatuses.join(', ')}`
            });
        }

        if (
            doctor_id &&
            (!Number.isInteger(Number(doctor_id)) || Number(doctor_id) <= 0)
        ) {
            return res.status(400).json({
                success: false,
                message: 'doctor_id must be a positive integer'
            });
        }

        if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({
                success: false,
                message: 'Date must use YYYY-MM-DD format'
            });
        }

        const appointments =
            await appointmentService.getAllAppointments({
                status,
                doctor_id,
                date
            });

        res.status(200).json({
            success: true,
            message: 'Appointments retrieved successfully',
            data: appointments
        });
    } catch (error) {
        next(error);
    }
};


// GET /api/appointments/:id
const getAppointmentById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Appointment ID must be a positive integer'
            });
        }

        const appointment =
            await appointmentService.getAppointmentById(id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Appointment retrieved successfully',
            data: appointment
        });
    } catch (error) {
        next(error);
    }
};


// POST /api/appointments
const createAppointment = async (req, res, next) => {
    try {
        const {
            patient_name,
            patient_contact,
            doctor_id,
            appointment_date,
            reason,
            status = 'pending'
        } = req.body;

        if (!patient_name || !patient_name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Patient name is required'
            });
        }

        if (!patient_contact || !patient_contact.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Patient contact is required'
            });
        }

        if (
            !doctor_id ||
            !Number.isInteger(Number(doctor_id)) ||
            Number(doctor_id) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: 'Valid doctor_id is required'
            });
        }

        if (!appointment_date) {
            return res.status(400).json({
                success: false,
                message: 'Appointment date and time is required'
            });
        }

        if (!reason || !reason.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Appointment reason is required'
            });
        }

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Allowed values: ${validStatuses.join(', ')}`
            });
        }

        const doctorExists =
            await appointmentService.doctorExists(doctor_id);

        if (!doctorExists) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        const conflict =
            await appointmentService.hasAppointmentConflict(
                doctor_id,
                appointment_date
            );

        if (conflict) {
            return res.status(409).json({
                success: false,
                message: 'This doctor already has an appointment at this date and time'
            });
        }

        const appointment =
            await appointmentService.createAppointment({
                patient_name: patient_name.trim(),
                patient_contact: patient_contact.trim(),
                doctor_id,
                appointment_date,
                reason: reason.trim(),
                status
            });

        res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
            data: appointment
        });
    } catch (error) {
        next(error);
    }
};


// PUT /api/appointments/:id
const updateAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Appointment ID must be a positive integer'
            });
        }

        const existingAppointment =
            await appointmentService.getAppointmentById(id);

        if (!existingAppointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        const {
            patient_name,
            patient_contact,
            doctor_id,
            appointment_date,
            reason,
            status
        } = req.body;

        if (!patient_name || !patient_name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Patient name is required'
            });
        }

        if (!patient_contact || !patient_contact.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Patient contact is required'
            });
        }

        if (
            !doctor_id ||
            !Number.isInteger(Number(doctor_id)) ||
            Number(doctor_id) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: 'Valid doctor_id is required'
            });
        }

        if (!appointment_date) {
            return res.status(400).json({
                success: false,
                message: 'Appointment date and time is required'
            });
        }

        if (!reason || !reason.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Appointment reason is required'
            });
        }

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Allowed values: ${validStatuses.join(', ')}`
            });
        }

        const doctorExists =
            await appointmentService.doctorExists(doctor_id);

        if (!doctorExists) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        const conflict =
            await appointmentService.hasAppointmentConflict(
                doctor_id,
                appointment_date,
                id
            );

        if (conflict) {
            return res.status(409).json({
                success: false,
                message: 'This doctor already has an appointment at this date and time'
            });
        }

        const appointment =
            await appointmentService.updateAppointment(id, {
                patient_name: patient_name.trim(),
                patient_contact: patient_contact.trim(),
                doctor_id,
                appointment_date,
                reason: reason.trim(),
                status
            });

        res.status(200).json({
            success: true,
            message: 'Appointment updated successfully',
            data: appointment
        });
    } catch (error) {
        next(error);
    }
};


// DELETE /api/appointments/:id
const deleteAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Appointment ID must be a positive integer'
            });
        }

        const existingAppointment =
            await appointmentService.getAppointmentById(id);

        if (!existingAppointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        await appointmentService.deleteAppointment(id);

        res.status(200).json({
            success: true,
            message: 'Appointment deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment
};