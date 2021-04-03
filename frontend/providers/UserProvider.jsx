import React, { useState } from 'react';
import PropTypes from 'prop-types';
import UserContext from './UserContext';

const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);

  const userContext = {
    setData: (userObject) => setUserData(userObject),
    setToken: (token) => setToken(token),
    logOutUser: () => {
      userContext.setData(null);
      setJwtToken(null);
      deleteCookie('refresh_token');
    },
    userData,
    token,
  };

  return (
    <UserContext.Provider value={userContext}>{children}</UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default UserProvider;
