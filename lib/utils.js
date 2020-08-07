/**
 * Returns true if the argument is empty.
 * 
 * @see https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_isempty
 */
export const isEmpty = obj => (
  [Object, Array].includes((obj || {}).constructor) && !Object.entries((obj || {})).length
);

/**
 * Returns a default value instead if value is empty.
 */
export const withEmptyDefault = (value, defaultValue) => (
  isEmpty(value) ? defaultValue : value
);

/**
 * Converts a UTC date to a date with the local timezone.
 */
export const parseUTCDate = (value) => {
  const date = new Date(value);
  date.setTime(date.getTime() + date.getTimezoneOffset() * 60000);
  return date; 
};

/**
 * Converts a date string from ISO format to native date picker format.
 * 
 * @param {string} value A date string in ISO format
 * @returns {string} A date string in 'yyyy-MM-dd' native date picker format
 */
export const decodePickerDate = (value) => {
  if (isEmpty(value)) {
    return '';
  }

  try {
    const date = parseUTCDate(value);
    const yyyy = date.getFullYear().toString().padStart(4, '0');
    const MM = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
  
    return `${yyyy}-${MM}-${dd}`;
  } catch (err) {
    console.warn(err);
    return value;
  }
};

/**
 * Converts a date string from native date picker format to ISO format.
 * 
 * @param {string} value A date string in 'yyyy-MM-dd' native date picker format
 * @returns {string} A date string in ISO format
 */
export const encodePickerDate = (value) => {
  if (isEmpty(value)) {
    return null;
  }

  try {
    return parseUTCDate(value).toISOString();
  } catch (err) {
    console.warn(err);
    return value;
  }
};
