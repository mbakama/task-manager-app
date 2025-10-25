// Supprimer les warnings de react-beautiful-dnd pour React 18
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Support for defaultProps will be removed from memo components')
  ) {
    return;
  }
  originalError.call(console, ...args);
};