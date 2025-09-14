const pool = require('../config/database');

class Medicine {
    constructor(name, company_id, location_id) {
        this.name = name;
        this.company_id = company_id;
        this.location_id = location_id;
    }

    // Create a new medicine
    static async create(name, company_id, location_id) {
        const query = 'INSERT INTO medicines (name, company_id, location_id) VALUES ($1, $2, $3) RETURNING *';
        const values = [name, company_id, location_id];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Get all medicines with company and location details
    static async findAll() {
        const query = `
      SELECT 
        m.id,
        m.name,
        c.name as company_name,
        l.name as location_name,
        m.company_id,
        m.location_id
      FROM medicines m
      JOIN companies c ON m.company_id = c.id
      JOIN locations l ON m.location_id = l.id
      ORDER BY m.name ASC
    `;

        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // Get medicine by ID with company and location details
    static async findById(id) {
        const query = `
      SELECT 
        m.id,
        m.name,
        c.name as company_name,
        l.name as location_name,
        m.company_id,
        m.location_id
      FROM medicines m
      JOIN companies c ON m.company_id = c.id
      JOIN locations l ON m.location_id = l.id
      WHERE m.id = $1
    `;
        const values = [id];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Search medicines by name (for fuzzy search)
    static async searchByName(searchTerm, limit = 10) {
        const query = `
      SELECT 
        m.id,
        m.name,
        c.name as company_name,
        l.name as location_name,
        m.company_id,
        m.location_id
      FROM medicines m
      JOIN companies c ON m.company_id = c.id
      JOIN locations l ON m.location_id = l.id
      WHERE m.name ILIKE $1
      ORDER BY m.name ASC
      LIMIT $2
    `;
        const values = [`%${searchTerm}%`, limit];

        try {
            const result = await pool.query(query, values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // Update medicine
    static async update(id, name, company_id, location_id) {
        const query = 'UPDATE medicines SET name = $1, company_id = $2, location_id = $3 WHERE id = $4 RETURNING *';
        const values = [name, company_id, location_id, id];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Delete medicine
    static async delete(id) {
        const query = 'DELETE FROM medicines WHERE id = $1';
        const values = [id];

        try {
            const result = await pool.query(query, values);
            return result.rowCount > 0;
        } catch (error) {
            throw error;
        }
    }

    // Get medicines by company
    static async findByCompany(company_id) {
        const query = `
      SELECT 
        m.id,
        m.name,
        c.name as company_name,
        l.name as location_name,
        m.company_id,
        m.location_id
      FROM medicines m
      JOIN companies c ON m.company_id = c.id
      JOIN locations l ON m.location_id = l.id
      WHERE m.company_id = $1
      ORDER BY m.name ASC
    `;
        const values = [company_id];

        try {
            const result = await pool.query(query, values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // Get medicines by location
    static async findByLocation(location_id) {
        const query = `
      SELECT 
        m.id,
        m.name,
        c.name as company_name,
        l.name as location_name,
        m.company_id,
        m.location_id
      FROM medicines m
      JOIN companies c ON m.company_id = c.id
      JOIN locations l ON m.location_id = l.id
      WHERE m.location_id = $1
      ORDER BY m.name ASC
    `;
        const values = [location_id];

        try {
            const result = await pool.query(query, values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Medicine;
