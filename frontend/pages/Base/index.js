import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Base from './Base';

import GlobalContextProvider from '../../providers/GlobalContextProvider';

var mountNode = document.getElementById('app');
ReactDOM.render(
  <BrowserRouter>
    <GlobalContextProvider>
      <Base />
    </GlobalContextProvider>
  </BrowserRouter>,
  mountNode
);
