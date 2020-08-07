import * as db from '../../../lib/db';
import TodoSchema from '../../../schemas/todo';
import { handleError, handleMethodNotAllowedError } from '../../../errors';

export default async (req, res) => {
  const {
    method,
    body
  } = req;
  switch (method) {
    case 'GET': {
      try {
        const sql = `
          select * from todo
          order by
            completion_date desc,
            target_completion_date desc,
            name asc`;
        const result = await db.query(sql);
        res.status(200).json(result.rows);
      } catch (err) {
        handleError(res, err);
      }
      break;
    }
    case 'POST':
      try {
        const {
          name,
          description,
          target_completion_date
        } = await TodoSchema.createTodo.validate(body, { abortEarly: false });
        const sql = `
          insert into todo (name, description, target_completion_date)
          values ($1, $2, $3)
          returning *`;
        const params = [name, description, target_completion_date];
        const result = await db.query(sql, params);
        const [row] = result.rows;
        res.status(201).json(row);
      } catch (err) {
        handleError(res, err);
      }
      break;
    default:
      handleMethodNotAllowedError(res, method, ['GET', 'POST']);
      break;
  }
};
