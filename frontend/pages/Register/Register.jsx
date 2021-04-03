import React, { useState, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import UserContext from '../../providers/UserContext';

import { Redirect, Link } from 'react-router-dom';

function Register(props) {
  const userContext = useContext(UserContext);

  const [error, setError] = useState(null);

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async function (e) {
    e.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const req = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name, password }),
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

  const AuthRedirect = () => {
    if (userContext.token) return <Redirect to='/' />;
  };

  return (
    <div>
      {AuthRedirect()}
      <form action='POST' onSubmit={handleSubmit}>
        <input type='name' ref={nameRef} placeholder='Jméno' />
        <br />
        <input type='email' ref={emailRef} placeholder='E-mail' />
        <br />
        <input type='password' ref={passwordRef} placeholder='Heslo' />
        <br />
        <button type='submit'>Registrovat se</button>
        <span style={{ color: 'red' }}>{error}</span>
      </form>
      <hr />
      <Link to='/login'>Již mám účet</Link>
    </div>
  );
}

Register.propTypes = {};

export default Register;
