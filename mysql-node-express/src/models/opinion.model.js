const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
class OpinionModel {
    tableName = 'opinion';

    find = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;

        return await query(sql, [...values]);
    }

    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

        const result = await query(sql, [...values]);

        return result[0];
    }

    findByBookId = async (id_book) => {
        const sql = `SELECT * FROM ${this.tableName} WHERE id_book = ?`;
        const result = await query(sql, [id_book]);

        if (!result.length) {
            return null;
        }

        return result;
    }

    create = async ({ id_book, text, progress = null }) => {
        const sql = `INSERT INTO ${this.tableName}
        (id_book, text, progress) VALUES (?,?,?)`;

        const result = await query(sql, [id_book, text, progress]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    update = async (params, id_opinion) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE id_opinion = ?`;

        const result = await query(sql, [...values, id_opinion]);

        return result;
    }

    delete = async (id_opinion) => {
        const sql = `DELETE FROM ${this.tableName}
        WHERE id_opinion = ?`;
        const result = await query(sql, [id_opinion]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }
}

module.exports = new OpinionModel;