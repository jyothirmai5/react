import './App.css';
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Students from './Students';
import CreateStudent from './CreateStudent';

function App() {

  return (
    <Router>
      <Switch>
        <Route exact path="/" render={() => (
          <Redirect to='/students'></Redirect>
        )}>
        </Route>
        <Route path="/students">
          <Students />
        </Route>
        <Route path="/student">
          <CreateStudent />
        </Route>
      </Switch>
    </Router>
  )
}

export default App;
