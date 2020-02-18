import React from "react";
import "./App.css";
import { Route } from 'react-router-dom';
import { Signin, Signup, Chat } from './pages/';

function App() {
  return (
    <div className="App">
      <Route exact path="/" component={Signin}/>
      <Route path="/signup" component={Signup}/>
      <Route path="/chat" component={Chat}/>
    </div>
  );
}

export default App;