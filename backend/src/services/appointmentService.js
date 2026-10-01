const db = require('../config/database');


// Get all appointments
const getAllAppointments = async (filters = {}) => {
    let query = `
        SELECT
            a.id,
            a.patient_name,
            a.patient_contact,
            a.doctor_id,
            d.name AS doctor_name,
            d.specialization AS doctor_specialization,
            a.appointment_date,
            a.reason,
            a.status,
            a.created_at,
            a.updated_at
        FROM appointments a
        INNER JOIN doctors d ON d.id = a.doctor_id
        WHERE 1 = 1
    `;

    const params = [];

    if (filters.status) {
        query += ` AND a.status = ?`;
        params.push(filters.status);
    }

    if (filters.doctor_id) {
        query += ` AND a.doctor_id = ?`;
        params.push(filters.doctor_id);
    }

    if (filters.date) {
        query += ` AND DATE(a.appointment_date) = ?`;
        params.push(filters.date);
    }

    query += ` ORDER BY a.appointment_date ASC`;

    const [rows] = await db.query(query, params);

    return rows;
};


// Get appointment by ID
const getAppointmentById = async (id) => {
    const [rows] = await db.query(
        `
        SELECT
            a.id,
            a.patient_name,
            a.patient_contact,
            a.doctor_id,
            d.name AS doctor_name,
            d.specialization AS doctor_specialization,
            a.appointment_date,
            a.reason,
            a.status,
            a.created_at,
            a.updated_at
        FROM appointments a
        INNER JOIN doctors d ON d.id = a.doctor_id
        WHERE a.id = ?
        LIMIT 1
        `,
        [id]
    );

    return rows[0] || null;
};


// Check whether doctor exists
const doctorExists = async (doctorId) => {
    const [rows] = await db.query(
        `
        SELECT id
        FROM doctors
        WHERE id = ?
        LIMIT 1
        `,
        [doctorId]
    );

    return rows.length > 0;
};


// Check appointment conflict
const hasAppointmentConflict = async (
    doctorId,
    appointmentDate,
    excludeAppointmentId = null
) => {
    let query = `
        SELECT id
        FROM appointments
        WHERE doctor_id = ?
        AND appointment_date = ?
        AND status != 'cancelled'
    `;

    const params = [doctorId, appointmentDate];

    if (excludeAppointmentId) {
        query += ` AND id != ?`;
        params.push(excludeAppointmentId);
    }

    query += ` LIMIT 1`;

    const [rows] = await db.query(query, params);

    return rows.length > 0;
};


// Create appointment
const createAppointment = async (appointmentData) => {
    const {
        patient_name,
        patient_contact,
        doctor_id,
        appointment_date,
        reason,
        status = 'pending'
    } = appointmentData;

    const [result] = await db.query(
        `
        INSERT INTO appointments
        (
            patient_name,
            patient_contact,
            doctor_id,
            appointment_date,
            reason,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            patient_name,
            patient_contact,
            doctor_id,
            appointment_date,
            reason,
            status
        ]
    );

    return getAppointmentById(result.insertId);
};


// Update appointment
const updateAppointment = async (id, appointmentData) => {
    const {
        patient_name,
        patient_contact,
        doctor_id,
        appointment_date,
        reason,
        status
    } = appointmentData;

    const [result] = await db.query(
        `
        UPDATE appointments
        SET
            patient_name = ?,
            patient_contact = ?,
            doctor_id = ?,
            appointment_date = ?,
            reason = ?,
            status = ?
        WHERE id = ?
        `,
        [
            patient_name,
            patient_contact,
            doctor_id,
            appointment_date,
            reason,
            status,
            id
        ]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return getAppointmentById(id);
};


// Delete appointment
const deleteAppointment = async (id) => {
    const [result] = await db.query(
        `
        DELETE FROM appointments
        WHERE id = ?
        `,
        [id]
    );

    return result.affectedRows > 0;
};


module.exports = {
    getAllAppointments,
    getAppointmentById,
    doctorExists,
    hasAppointmentConflict,
    createAppointment,
    updateAppointment,
    deleteAppointment
};