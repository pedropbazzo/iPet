import { Route, BrowserRouter } from 'react-router-dom';
import React from 'react';

import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';
import EditPoint from './pages/EditPoint';

const Routes = () => {
  return (
      <BrowserRouter>
        <Route component={Home} path="/" exact/>
        <Route component={CreatePoint} path="/create-point"/>
        <Route component={EditPoint} path="/edit-point"/>

      </BrowserRouter>
  );
}

export default Routes;