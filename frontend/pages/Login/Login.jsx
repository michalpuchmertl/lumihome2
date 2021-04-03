import React, { useState, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import UserContext from '../../providers/UserContext';

import { Redirect, Link } from 'react-router-dom';

function Login(props) {
  const userContext = useContext(UserContext);

  const [error, setError] = useState(null);

  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async function (e) {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const req = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const res = await req.json();

    if (!res.success) {
      return setError(res.error);
    }
    const { user, token } = res.data;
    await userContext.setData(user);
    await userContext.setToken(token);
    await localStorage.setItem('token', token);
  };

  const renderName = () => {
    if (userContext.userData) {
      return `Ahoj, ${userContext.userData.name}`;
    }
  };

  const AuthRedirect = () => {
    if (userContext.token || localStorage.getItem('token')) return <Redirect to='/' />;
  };

  return (
    <div>
      {/* {AuthRedirect()} */}
      <button onClick={(e)=>console.log(e)}></button>

      <form>
        <input type='email' ref={emailRef} placeholder='E-Mail' />
        <br />
        <input type='password' ref={passwordRef} placeholder='Heslo' />
        <br />
        <br />
        <span style={{ color: 'red' }}>{error}</span>
      </form>
      <hr />
      {/* <Link to='/register'>Ještě nemám účet</Link> */}
    </div>
  );
}

Login.propTypes = {};

export default Login;
