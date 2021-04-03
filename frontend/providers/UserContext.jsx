import { createContext } from 'react';

/**
 * Default value to be overwritten by backend
 */
const UserContext = createContext({
  data: undefined,
  token: undefined,
  setData: undefined,
  isUserLoggedIn: () => false, // user is by default not logged in
  logOutUser: () => undefined,
});
export default UserContext;
