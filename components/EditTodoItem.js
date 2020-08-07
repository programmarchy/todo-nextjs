import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { TodoContext } from '../contexts/todo';
import TodoCheckbox from './TodoCheckbox';
import TodoForm from './TodoForm';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: -1
  }
}));

export default function EditTodoItem({ todo, onCancel, onSave }) {
  const classes = useStyles();

  const [, dispatch] = React.useContext(TodoContext);

  const [fetching, setFetching] = React.useState(false);
  const [validationError, setValidationError] = React.useState(null);

  const { id } = todo;

  const handleSubmit = async (values) => {
    setValidationError(null);
    setFetching(true);
    try {
      const url = `/api/todos/${id}`;
      const result = await fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(values)
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
          onSave && onSave();
          break;
        default: {
          const { error } = payload;
          if (error.name === 'ValidationError') {
            setValidationError(error);
          } else {
            dispatch({
              type: 'ERROR',
              error
            });
          }
          break;
        }
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
    <Paper className={classes.root} elevation={4}>
      <Box display="flex" flexDirection="row" alignItems="flex-start">
        <Box flex={0} m={1}>
          <TodoCheckbox
            todo={todo}
            fetchingState={[fetching, setFetching]}
          />
        </Box>
        <Box flex={1} my={0.5} mr={1}>
          <TodoForm
            initialValues={todo}
            validationError={validationError}
            disabled={fetching}
            onCancel={onCancel}
            onSubmit={handleSubmit}
          />
        </Box>
      </Box>
    </Paper>
  );
};
