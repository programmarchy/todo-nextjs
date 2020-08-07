import * as db from '../../../../lib/db';
import { handleError, handleMethodNotAllowedError } from '../../../../errors';
import TodoSchema from '../../../../schemas/todo';
import NotFoundError from '../../../../errors/NotFoundError';

export default async (req, res) => {
  const {
    method,
    query,
    body
  } = req;
  switch (method) {
    case 'GET': {
      try {
        const result = await db.query(`select * from todo where id = $1`, [query.id]);
        if (result.rowCount === 0) {
          throw new NotFoundError(`Todo (id = ${id}) not found.`);
        }
        const [row] = result.rows;
        res.status(200).json(row);
      } catch (err) {
        handleError(res, err);
      }
      break;
    }
    case 'PATCH':
      try {
        const {
          name,
          description,
          target_completion_date,
          completion_date
        } = await TodoSchema.updateTodo.validate(body, { abortEarly: false });
        const sql = `
          update todo
          set name = $2, description = $3, target_completion_date = $4, completion_date = $5
          where id = $1
          returning *`;
        const params = [query.id, name, description, target_completion_date, completion_date];
        const result = await db.query(sql, params);
        if (result.rowCount === 0) {
          throw new NotFoundError(`Todo (id = ${id}) not found.`);
        }
        const [row] = result.rows;
        res.status(200).json(row);
      } catch (err) {
        handleError(res, err);
      }
      break;
    case 'DELETE':
      try {
        const sql = `
          delete from todo
          where id = $1
        `;
        const params = [query.id];
        const result = await db.query(sql, params);
        if (result.rowCount === 0) {
          throw new NotFoundError(`Todo (id = ${id}) not found.`);
        }
        res.status(204).end();
      } catch (err) {
        handleError(res, err);
      }
      break;
    default:
      handleMethodNotAllowedError(res, method, ['GET', 'PATCH', 'DELETE']);
      break;
  }
};
