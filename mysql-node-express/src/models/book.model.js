const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
class BookModel {
    tableName = 'book';

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

    findByUserId = async (id_user) => {
        const sql = `SELECT * FROM ${this.tableName} WHERE id_author = ?`;
        const result = await query(sql, [id_user]);

        if (!result.length) {
            return null;
        }

        return result;
    }

    findByTitleAndUser = async (title, id_user) => {
        const sql = `SELECT * FROM ${this.tableName} WHERE title = ? AND id_author = ?`;
        const result = await query(sql, [title, id_user]);
        if (!result.length) {
            return null;
        }
        return result[0];
    }



    create = async ({ title, author, id_author, description = null, size=null, progress = null, raiting = null, file_img = null, file = null }) => {
        const sql = `INSERT INTO ${this.tableName}
        (title, author, id_author, description, size, progress, raiting, file_img, file) VALUES (?,?,?,?,?,?,?,?,?)`;

        const result = await query(sql, [title, author, id_author, description, size, progress, raiting, file_img, file]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    update = async (params, id_book) => {
        console.log(params, id_book);
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE book SET ${columnSet} WHERE id_book = ?`;

        const result = await query(sql, [...values, id_book]);

        return result;
    }

    delete = async (id_book) => {
        const sql = `DELETE FROM ${this.tableName}
        WHERE id_book = ?`;
        const result = await query(sql, [id_book]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }
}

module.exports = new BookModel;