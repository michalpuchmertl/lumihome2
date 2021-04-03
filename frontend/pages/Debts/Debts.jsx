import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { Redirect } from 'react-router-dom';

import UserContext from '../../providers/UserContext';

function Debts(props) {
  const userContext = useContext(UserContext);

  const AuthRedirect = () => {
    if (!userContext.token) return <Redirect to={'/login'} />;
    return <h1>Vítej {userContext.userData.name}</h1>;
  };

  return <>{AuthRedirect()}</>;
}

Debts.propTypes = {};

export default Debts;
