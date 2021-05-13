import logo from './logo.svg';
import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Redirect from './Redirect'

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/project/:id" render={(props) => <Redirect {...props} />} />
      </Router>
    </div>
  );
}

export default App;
