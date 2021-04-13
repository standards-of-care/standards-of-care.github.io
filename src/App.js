import React, {Fragment, useEffect, useState} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"

import ListView from './components/ListView'
import FileView from './components/FileView'
import {Header} from './components/Header'
import './App.css';

function App (props) {
  return (
    <Router>
      <div className="App">

        <Header />

        <Switch>
          <Route exact path="/">
            <ListView />
          </Route>

          <Route path="/:fileID">
            <FileView />
          </Route>
        </Switch>
        
      </div>
    </Router>
  )
}

export default App;
