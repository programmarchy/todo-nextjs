import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withEmptyDefault, decodePickerDate, encodePickerDate } from '../lib/utils';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  actions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    '& > *': {
      marginRight: theme.spacing(1)
    }
  }
}));

export default function TodoForm({
  initialValues = {},
  margin = 'dense',
  onSubmit,
  onCancel,
  validationError,
  disabled
}) {
  const classes = useStyles();

  const inputRefs = {
    name: React.useRef(),
    description: React.useRef(),
    target_completion_date: React.useRef(),
    completion_date: React.useRef()
  };

  const getFormValue = (name, defaultValue) => {
    if (inputRefs[name] && inputRefs[name].current) {
      return withEmptyDefault(inputRefs[name].current.value, defaultValue);
    } else {
      return defaultValue;
    }
  };

  const { id } = initialValues;
  const isNew = !id;

  const handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    onSubmit && onSubmit({
      name: getFormValue('name'),
      description: getFormValue('description', null),
      target_completion_date: encodePickerDate(getFormValue('target_completion_date')),
      completion_date: encodePickerDate(getFormValue('completion_date', null))
    });
  };

  const handleCancel = e => {
    e.preventDefault();
    e.stopPropagation();
    onCancel && onCancel();
  };

  return (
    // An uncontrolled form is used so that native date pickers play better.
    <form className={classes.root} noValidate>
      <TextField
        label="Name"
        inputRef={inputRefs.name}
        defaultValue={withEmptyDefault(initialValues.name, '')}
        {...getValidationProps(validationError, 'name')}
        disabled={disabled}
        margin={margin}
        variant="outlined"
        required
      />
      <TextField
        label="Description"
        inputRef={inputRefs.description}
        defaultValue={withEmptyDefault(initialValues.description, '')}
        disabled={disabled}
        margin={margin}
        variant="outlined"
        multiline
        rows={4}
      />
      <TextField
        label="Target Completion Date"
        inputRef={inputRefs.target_completion_date}
        defaultValue={decodePickerDate(withEmptyDefault(initialValues.target_completion_date, new Date().toISOString()))}
        {...getValidationProps(validationError, 'target_completion_date')}
        disabled={disabled}
        margin={margin}
        type="date"
        variant="outlined"
        required
        placeholder="yyyy-mm-dd"
        InputLabelProps={{
          shrink: true
        }}
      />
      {!isNew && <TextField
        label="Completion Date"
        inputRef={inputRefs.completion_date}
        defaultValue={decodePickerDate(withEmptyDefault(initialValues.completion_date, ''))}
        {...getValidationProps(validationError, 'completion_date')}
        disabled={disabled}
        margin={margin}
        type="date"
        variant="outlined"
        placeholder="yyyy-mm-dd"
        InputLabelProps={{
          shrink: true
        }}
      />}
      <Box
        className={classes.actions}
        display="flex"
        flexDirection="row"
      >
        <Button
          onClick={handleSubmit}
          disabled={disabled}
          color="primary"
          variant="contained"
          size="small"
        >
          Save
        </Button>
        <Button
          onClick={handleCancel}
          disabled={disabled}
          color="primary"
          size="small"
        >
          Cancel
        </Button>
      </Box>
    </form>
  );
};

function getValidationProps(error, path) {
  const message = getValidationErrorInnerMessage(error, path);
  if (message) {
    return {
      error: true,
      helperText: message
    };
  } else {
    return {
      error: false
    };
  }
}

function getValidationErrorInnerMessage(error, path) {
  if (error && error.inner) {
    const inner = error.inner.find(inner => inner.path === path);
    if (inner) {
      return inner.message;
    }
  }

  return null;
}
