import React, {Fragment, useEffect, useState} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"

import ListView from './components/ListView'
import FileView from './components/FileView'
import ManageView from './components/ManageView'
import EditFileView from './components/EditFileView'
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

          <Route path="/manage">
            <ManageView />
          </Route>

          <Route path="/upload">
            <EditFileView isNewFile={true} />
          </Route>

          <Route exact path="/:fileID">
            <FileView />
          </Route>

          <Route exact path="/:fileID/edit">
            <EditFileView />
          </Route>
        </Switch>
        
      </div>
    </Router>
  )
}

export default App;
