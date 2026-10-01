const db = require('../config/database');

// Get all doctors
const getAllDoctors = async (search = '') => {
    let query = `
        SELECT
            id,
            name,
            specialization,
            phone,
            email,
            availability,
            is_active,
            created_at,
            updated_at
        FROM doctors
    `;

    const params = [];

    if (search) {
        query += `
            WHERE
                name LIKE ?
                OR specialization LIKE ?
                OR phone LIKE ?
                OR email LIKE ?
        `;

        const searchTerm = `%${search}%`;

        params.push(
            searchTerm,
            searchTerm,
            searchTerm,
            searchTerm
        );
    }

    query += ` ORDER BY created_at DESC`;

    const [rows] = await db.query(query, params);

    return rows;
};


// Get doctor by ID
const getDoctorById = async (id) => {
    const [rows] = await db.query(
        `
        SELECT
            id,
            name,
            specialization,
            phone,
            email,
            availability,
            is_active,
            created_at,
            updated_at
        FROM doctors
        WHERE id = ?
        LIMIT 1
        `,
        [id]
    );

    return rows[0] || null;
};


// Create doctor
const createDoctor = async (doctorData) => {
    const {
        name,
        specialization,
        phone,
        email,
        availability,
        is_active = true
    } = doctorData;

    const [result] = await db.query(
        `
        INSERT INTO doctors
        (
            name,
            specialization,
            phone,
            email,
            availability,
            is_active
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            name,
            specialization,
            phone || null,
            email || null,
            availability || null,
            is_active
        ]
    );

    return getDoctorById(result.insertId);
};


// Update doctor
const updateDoctor = async (id, doctorData) => {
    const {
        name,
        specialization,
        phone,
        email,
        availability,
        is_active
    } = doctorData;

    const [result] = await db.query(
        `
        UPDATE doctors
        SET
            name = ?,
            specialization = ?,
            phone = ?,
            email = ?,
            availability = ?,
            is_active = ?
        WHERE id = ?
        `,
        [
            name,
            specialization,
            phone || null,
            email || null,
            availability || null,
            is_active,
            id
        ]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return getDoctorById(id);
};


// Delete doctor
const deleteDoctor = async (id) => {
    const [result] = await db.query(
        `
        DELETE FROM doctors
        WHERE id = ?
        `,
        [id]
    );

    return result.affectedRows > 0;
};


module.exports = {
    getAllDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor
};