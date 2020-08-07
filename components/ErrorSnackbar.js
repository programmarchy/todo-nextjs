import React from 'react';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

export default function ErrorSnackbar({ error }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(!!error);
  }, [error]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert elevation={6} variant="filled" severity="error" onClose={handleClose}>
        {error.message}
      </Alert>
    </Snackbar>
  );
};
