import * as yup from 'yup';

export default {
  createTodo: yup.object({
    name: yup.string().typeError('Enter a name').required('Field is required'),
    description: yup.string().typeError('Enter a description').nullable(),
    target_completion_date: yup.date('Enter a date').required('Field is required')
  }),
  updateTodo: yup.object({
    name: yup.string().typeError('Enter a name').required('Field is required'),
    description: yup.string().typeError('Enter a description').nullable(),
    target_completion_date: yup.date().typeError('Enter a date').required('Field is required'),
    completion_date: yup.date().typeError('Enter a date').nullable()
  }),
  completeTodo: yup.object({
    completion_date: yup.date().typeError('Enter a date').nullable()
  })
};
