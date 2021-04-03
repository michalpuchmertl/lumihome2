import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader/root';

import { Switch, Route, Redirect } from 'react-router-dom';

import Login from '../Login/Login';
import Register from '../Register/Register';
import Debts from '../Debts/Debts';

import UserContext from '../../providers/UserContext';

function Base(props) {
  const userContext = useContext(UserContext);

  return (
    <main>
      <Switch>
        <Route path='/login' component={Login}></Route>
        <Route path='/register' component={Register}></Route>
        <Route path='/' component={Debts}></Route>
      </Switch>
    </main>
  );
}

Base.propTypes = {};

export default hot(Base);
