import React from 'react';
import Immutable from 'immutable';

export const TodoContext = React.createContext();

const compare = (key) => {
  return (a, b) => {
    return (
      (a.get(key) === null && b.get(key) !== null) ? 1 : (
        (b.get(key) === null && a.get(key) !== null) ? -1 : (
          (a.get(key) > b.get(key)) ? 1 : (
            (b.get(key) > a.get(key)) ? -1 : (
              0
    )))));
  };
};

const compareTodo = (a, b) => {
  let result = 0;

  result = compare('completion_date')(b, a);
  if (result !== 0) {
    return result;
  }

  result = compare('target_completion_date')(b, a);
  if (result !== 0) {
    return result;
  }

  return compare('name')(a, b);
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_TODO':
      return {
        data: Immutable
          .fromJS(state.data)
          .push(Immutable.fromJS(action.payload))
          .sort(compareTodo)
          .toJS(),
        error: null
      };
    case 'DELETE_TODO':
      return {
        data: Immutable
          .fromJS(state.data)
          .filter(todo => todo.get('id') !== action.id)
          .toJS(),
        error: null
      };
    case 'UPDATE_TODO': {
      const data = Immutable.fromJS(state.data);
      const index = data.findIndex(todo =>
        todo.get('id') === action.id
      );
      return (index >= 0) ? {
        data: data
          .mergeIn([index], Immutable.fromJS(action.payload))
          .sort(compareTodo)
          .toJS(),
        error: null
      } : state;
    }
    case 'ERROR':
      return {
        ...state,
        error: action.error
      };
    default:
      return state.data;
  }
};

export const TodoContextProvider = ({ initialState, children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <TodoContext.Provider value={[state, dispatch]}>
      {children}
    </TodoContext.Provider>
  );
};
