import React from "react";
import { Switch, Route } from "react-router-dom";

import "./styles/tailwind.css";

import HomePage from "./containers/HomePage";
import Lobby from "./containers/Lobby";
import Gameworld from "./containers/Gameworld";

function App() {
  return (
    <div className="h-screen bg-gray-900">
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route path="/lobby">
          <Lobby />
        </Route>
        <Route path="/gameworld">
          <Gameworld />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
