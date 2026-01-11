import { createContext } from 'react';

const CrudModalContext = createContext({
  create: () => {},
  show: {
    default: () => {},
    paragraph: () => {},
    list: () => {},
    table: () => {}
  },
  edit: () => {},
  delete: {
    default: () => {},
    batch: () => {},
    confirm: () => {}
  },
  close: () => {},
  setIsLoading: () => {},
  setFormFields: () => {},
  width: undefined
});

export default CrudModalContext;
