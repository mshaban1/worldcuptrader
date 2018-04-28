import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import Control from "./pages/Control";
import Home from "./pages/Home";


const App =() => (  
  <Router>

    <Switch>
      <Route exact path="/" component={Home}/>
      <Route exact path="/control" component={Control} />
    </Switch>
  
    </Router>

);


export default App;
