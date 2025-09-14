const pool = require('../config/database');

class Company {
    constructor(name) {
        this.name = name;
    }

    // Create a new company
    static async create(name) {
        const query = 'INSERT INTO companies (name) VALUES ($1) RETURNING *';
        const values = [name];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Get all companies
    static async findAll() {
        const query = 'SELECT * FROM companies ORDER BY name ASC';

        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // Get company by ID
    static async findById(id) {
        const query = 'SELECT * FROM companies WHERE id = $1';
        const values = [id];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Get company by name
    static async findByName(name) {
        const query = 'SELECT * FROM companies WHERE name = $1';
        const values = [name];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Update company
    static async update(id, name) {
        const query = 'UPDATE companies SET name = $1 WHERE id = $2 RETURNING *';
        const values = [name, id];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Delete company
    static async delete(id) {
        const query = 'DELETE FROM companies WHERE id = $1';
        const values = [id];

        try {
            const result = await pool.query(query, values);
            return result.rowCount > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Company;
