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
    case 'PATCH':
      try {
        const {
          completion_date
        } = await TodoSchema.completeTodo.validate(body, { abortEarly: false });
        const sql = `
          update todo
          set completion_date = $2
          where id = $1
          returning *`;
        const params = [query.id, completion_date];
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
    default:
      handleMethodNotAllowedError(res, method, ['PATCH']);
      break;
  }
};
