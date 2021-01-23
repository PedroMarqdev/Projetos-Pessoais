import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import Wallet from './pages/Wallet';
import './index.css';

function App() {
  return (
    <div>
      <Switch>
        <Route path="/walletredux/carteira" component={ Wallet } />
        <Route exact path="/walletredux/" component={ Login } />
      </Switch>
    </div>
  );
}

export default App;
