import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'Lato',
      'Helvetica',
      'sans-serif'
    ].join(','),
    h1: {
      fontSize: '2rem',
      fontWeight: '700'
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: '700'
    }
  },
  palette: {
    primary: {
      main: '#0091b4'
    },
    secondary: {
      main: '#4cbbe4'
    },
    error: {
      main: red.A400
    },
    background: {
      default: '#fff'
    }
  }
});

export default theme;
