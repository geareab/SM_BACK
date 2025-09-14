const pool = require('../config/database');

class Location {
    constructor(name) {
        this.name = name;
    }

    // Create a new location
    static async create(name) {
        const query = 'INSERT INTO locations (name) VALUES ($1) RETURNING *';
        const values = [name];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Get all locations
    static async findAll() {
        const query = 'SELECT * FROM locations ORDER BY name ASC';

        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // Get location by ID
    static async findById(id) {
        const query = 'SELECT * FROM locations WHERE id = $1';
        const values = [id];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Get location by name
    static async findByName(name) {
        const query = 'SELECT * FROM locations WHERE name = $1';
        const values = [name];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Update location
    static async update(id, name) {
        const query = 'UPDATE locations SET name = $1 WHERE id = $2 RETURNING *';
        const values = [name, id];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Delete location
    static async delete(id) {
        const query = 'DELETE FROM locations WHERE id = $1';
        const values = [id];

        try {
            const result = await pool.query(query, values);
            return result.rowCount > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Location;
