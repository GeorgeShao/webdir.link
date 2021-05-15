import logo from './logo.svg';
import './App.css';
import React from 'react';

import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";

import Redirect from './pages/Redirect'
import Shortener from './pages/Shortener'

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/"><Shortener/></Route>
        <Route exact path="/:shortlink" render={(props) => <Redirect {...props} />} />
      </Router>
    </div>
  );
}

export default App;
