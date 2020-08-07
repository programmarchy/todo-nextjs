import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import { TodoContext } from '../contexts/todo';

export default function TodoCheckbox({
  todo,
  fetchingState
}) {
  const [, dispatch] = React.useContext(TodoContext);

  const [fetching, setFetching] = fetchingState;

  if (fetching) {
    return (
      <div
        style={{
          width: 42,
          height: 42,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CircularProgress disableShrink color="primary" size='24px' />
      </div>
    );
  }

  const { id, completion_date } = todo;
  const checked = !!completion_date;

  const handleChange = async (e) => {
    e.stopPropagation();
    setFetching(true);
    const completion_date = e.target.checked ? new Date().toISOString() : null;
    try {
      const url = `/api/todos/${id}/completion`;
      const result = await fetch(url, {
        method: 'PATCH',
        body: JSON.stringify({
          completion_date
        })
      });
      const payload = await result.json();
      setFetching(false);
      switch (result.status) {
        case 200:
          dispatch({
            type: 'UPDATE_TODO',
            id,
            payload
          });
          break;
        default:
          dispatch({
            type: 'ERROR',
            error: payload.error
          });
          break;
      }
    } catch (err) {
      setFetching(false);
      const { name, message } = err;
      dispatch({
        type: 'ERROR',
        error: { name, message }
      });
    }
  };

  return (
    <Checkbox
      color="primary"
      checked={checked}
      onClick={e => e.stopPropagation() }
      onChange={handleChange}
    />
  );
};
