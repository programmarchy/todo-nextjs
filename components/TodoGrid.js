import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import Alert from '@material-ui/lab/Alert';
import { TodoContext } from '../contexts/todo';
import ErrorSnackbar from './ErrorSnackbar';
import TodoItem from './TodoItem';
import EditTodoItem from './EditTodoItem';
import CreateTodoDialog from './CreateTodoDialog';

const useStyles = makeStyles(theme => ({
  grid: {
    marginBottom: theme.spacing(16),
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.spacing(12),
    }
  },
  gridItem: {
    cursor: 'pointer'
  },
  fab: {
    zIndex: 999,
    position: 'fixed',
    bottom: theme.spacing(4),
    left: theme.spacing(4),
    transform: 'scale(1)',
    animation: '$pulse 1s 5',
    [theme.breakpoints.down('xs')]: {
      bottom: theme.spacing(2),
      left: theme.spacing(2)
    }
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)'
    },
    '66%': {
      transform: 'scale(0.85)'
    },
    '100%': {
      transform: 'scale(1)'
    }
  }
}));

export default function TodoGrid() {
  const classes = useStyles();

  const [state,] = React.useContext(TodoContext);

  const [selectedTodoId, setSelectedTodoId] = React.useState();
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);

  const handleSelect = todo => e => {
    setSelectedTodoId(todo.id);
  };

  if (!state.data) {
    return <TodoGridError error={state.error} />;
  }

  return (
    <div>
      <Grid container className={classes.grid}>
        {state.data.map(todo => {
          const editing = (todo.id === selectedTodoId);
          return (
            <Grid
              item
              xs={12}
              key={todo.id}
              onClick={handleSelect(todo)}
              className={editing ? classes.editGridItem : classes.gridItem}
            >
              {editing ? (
                <EditTodoItem
                  todo={todo}
                  onCancel={() => setSelectedTodoId(undefined)}
                  onSave={() => setSelectedTodoId(undefined)}
                />
              ) : (
                <TodoItem
                  todo={todo}
                />
              )}
            </Grid>
          );
        })}
      </Grid>
      {state.data.length === 0 && (
        <Alert variant="filled" severity="info">
          There's nothing to do yet. Tap the add button below to start something!
        </Alert>
      )}
      <Fab
        color="primary"
        aria-label="create"
        className={classes.fab}
        onClick={e => {
          e.stopPropagation();
          setCreateDialogOpen(true)
        }}
      >
        <AddIcon />
      </Fab>
      <CreateTodoDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSave={() => setCreateDialogOpen(false)}
      />
      {state.error && <ErrorSnackbar error={state.error} />}
    </div>
  );
};

function TodoGridError({ error }) {
  if (error) {
    return <Alert variant="filled" severity="error">{error.message}</Alert>;
  }

  return null;
}
