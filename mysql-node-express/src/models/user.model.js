const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
const Role = require('../utils/userRoles.utils');
class UserModel {
    tableName = 'user';

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

        // return back the first row (user)
        return result[0];
    }

    create = async ({ username, password, name, email, role = Role.SuperUser }) => {
        const sql = `INSERT INTO ${this.tableName}
        (username, password, name, email, role) VALUES (?,?,?,?,?)`;

        const result = await query(sql, [username, password, name, email, role]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    update = async (params, id_user) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE user SET ${columnSet} WHERE id_user = ?`;

        const result = await query(sql, [...values, id_user]);

        return result;
    }

    delete = async (id_user) => {
        const sql = `DELETE FROM ${this.tableName}
        WHERE id_user = ?`;
        const result = await query(sql, [id_user]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }
}

module.exports = new UserModel;