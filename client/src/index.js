import React from "react";
import ReactDOM from "react-dom";
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.scss';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import App from "./App";
import {Register,Login} from './screens/index'

ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/" exact render={(props) => <App {...props} />} />
      <Route path="/login" exact render={(props) => <Login {...props} />} />
    </Switch>
  </Router>,
  document.getElementById("root")
);
