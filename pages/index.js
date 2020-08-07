import React from 'react';
import Head from 'next/head';
import ErrorPage from 'next/error';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { TodoContextProvider } from '../contexts/todo';
import TodoGrid from '../components/TodoGrid';

const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
    margin: 0
  },
  header: {
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(1)
    }
  },
  main: {
    margin: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(1)
    }
  }
}));

export default function IndexPage({
  initialState,
  pageError
}) {
  const classes = useStyles();

  if (pageError) {
    return <ErrorPage {...pageError} />;
  }

  return (
    <Container className={classes.root}>
      <Head>
        <title>To Do</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={classes.main}>
        <Typography
          className={classes.header}
          variant="h1"
          gutterBottom
        >
          To Do
        </Typography>
        <TodoContextProvider initialState={initialState}>
          <TodoGrid />
        </TodoContextProvider>
      </main>
    </Container>
  );
};

export async function getServerSideProps({ req, res }) {
  try {
    const url = new URL(`${process.env.SERVER_URL}/api/todos`);
    const result = await fetch(url);
    const payload = await result.json();
    switch (result.status) {
      case 200:
        return {
          props: {
            initialState: {
              data: payload,
              error: null
            }
          }
        }
      default:
        return {
          props: {
            initialState: {
              data: null,
              error: payload.error
            }
          }
        };
    }
  } catch (err) {
    console.error(err);
    const statusCode = 500;
    res.statusCode = statusCode;
    return {
      props: {
        pageError: {
          statusCode
        }
      }
    };
  }
};
