import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { TodoContext } from '../contexts/todo';
import TodoForm from './TodoForm';

const useStyles = makeStyles(theme => ({
  dialogTitle: {
    paddingBottom: 0
  }
}));

export default function CreateTodoDialog({ open, onClose, onSave }) {
  const classes = useStyles();

  const [, dispatch] = React.useContext(TodoContext);

  const [fetching, setFetching] = React.useState(false);
  const [validationError, setValidationError] = React.useState(null);

  const handleSubmit = async (values) => {
    setValidationError(null);
    setFetching(true);
    try {
      const url = '/api/todos';
      const result = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(values)
      });
      const payload = await result.json();
      setFetching(false);
      switch (result.status) {
        case 201:
          dispatch({
            type: 'CREATE_TODO',
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
    <Dialog
      aria-labelledby="create-todo-dialog-title"
      open={open}
      onClose={onClose}
      fullWidth
    >
      <DialogTitle
        id="create-todo-dialog-title"
        className={classes.dialogTitle}
      >
        Create Todo
      </DialogTitle>
      <DialogContent>
        <Box mb={1}>
          <TodoForm
            validationError={validationError}
            disabled={fetching}
            onCancel={onClose}
            onSubmit={handleSubmit}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};
