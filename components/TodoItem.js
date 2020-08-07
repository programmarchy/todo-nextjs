import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import { TodoContext } from '../contexts/todo';
import { parseUTCDate } from '../lib/utils';
import TodoCheckbox from './TodoCheckbox';

const useStyles = makeStyles(theme => ({
  root: {
    '&:hover $deleteButton': {
      visibility: 'visible'
    }
  },
  date: {
    whiteSpace: 'nowrap',
    paddingTop: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(0.5),
    paddingRight: theme.spacing(1),
    borderRadius: theme.spacing(1),
    fontSize: '0.75rem',
    minWidth: 70,
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.5rem',
      minWidth: 50
    }
  },
  targetCompletionDate: {
    backgroundColor: theme.palette.grey[300],
  },
  completionDate: {
    color: 'white',
    backgroundColor: theme.palette.primary.main
  },
  divider: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  deleteButton: {
    visibility: 'hidden',
    [theme.breakpoints.down('xs')]: {
      visibility: 'visible'
    }
  }
}));

export default function TodoItem({ todo }) {
  const classes = useStyles();

  const [, dispatch] = React.useContext(TodoContext);

  const [fetching, setFetching] = React.useState(false);

  const {
    id,
    name,
    description,
    target_completion_date,
    completion_date
  } = todo;

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm(`Delete "${name}"?`)) {
      return;
    }
    setFetching(true);
    try {
      const url = `/api/todos/${id}`;
      const result = await fetch(url, {
        method: 'DELETE'
      });
      setFetching(false);
      switch (result.status) {
        case 204:
          dispatch({
            type: 'DELETE_TODO',
            id
          });
          break;
        default: {
          const { error } = await result.json();
          dispatch({
            type: 'ERROR',
            error
          });
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
    <div className={classes.root}>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box flex={0} m={1}>
          <TodoCheckbox
            todo={todo}
            fetchingState={[fetching, setFetching]}
          />
        </Box>
        <Hidden xsDown>
          {target_completion_date && (
            <Box flex={0} my={0.5} mr={1}>
              <Tooltip title="Target Completion Date" arrow>
                <div className={clsx(classes.date, classes.targetCompletionDate)}>
                  {formatDate(target_completion_date)}
                </div>
              </Tooltip>
            </Box>
          )}
          {completion_date && (
            <Box flex={0} my={0.5} mr={1}>
              <Tooltip title="Completion Date" arrow>
                <div className={clsx(classes.date, classes.completionDate)}>
                  {formatDate(completion_date)}
                </div>
              </Tooltip>
            </Box>
          )}
        </Hidden>
        <Box flex={1} my={0.5} mr={1}>
          <Tooltip title={description || ''} placement="bottom-start" enterDelay={500}>
            <Typography variant="body1">
              {name}
            </Typography>
          </Tooltip>
        </Box>
        <Box flex={0} my={0.5} mr={1}>
          <Tooltip title="Delete" arrow>
            <IconButton
              className={classes.deleteButton}
              aria-label="delete"
              onClick={handleDelete}
              disabled={fetching}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Hidden smUp>
        <Box display="flex" flexDirection="row" ml={7} mb={0.5}>
          {target_completion_date && (
            <Box flex={0} my={0.5} mr={1}>
              <Tooltip title="Target Completion Date" arrow>
                <div className={clsx(classes.date, classes.targetCompletionDate)}>
                  {formatDate(target_completion_date)}
                </div>
              </Tooltip>
            </Box>
          )}
          {completion_date && (
            <Box flex={0} my={0.5} mr={1}>
              <Tooltip title="Completion Date" arrow>
                <div className={clsx(classes.date, classes.completionDate)}>
                  {formatDate(completion_date)}
                </div>
              </Tooltip>
            </Box>
          )}
        </Box>
      </Hidden>
      <Divider className={classes.divider} />
    </div>
  );
};

const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
});

const currentDateTimeFormat = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric'
});

const currentFullYear = new Date().getFullYear();

function formatDate(value) {
  const date = parseUTCDate(value);
  if (date.getFullYear() === currentFullYear) {
    return currentDateTimeFormat.format(date);
  } else {
    return dateTimeFormat.format(date);
  }
}
