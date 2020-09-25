import React from "react";
import ReactDOM from "react-dom";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import App from "./App";
import {Register} from './screens/index'

ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/" exact render={(props) => <App {...props} />} />
      <Route path="/register" exact render={(props) => <Register {...props} />} />
    </Switch>
  </Router>,
  document.getElementById("root")
);
