import React, {Fragment, useEffect, useState} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"

import { DRIVE_ID } from './env'
import { getAccessToken } from './Utilities'

import ListView from './components/ListView'
import FileView from './components/FileView'
import EditFileView from './components/EditFileView'
import {Header} from './components/Header'
import './App.css';

function App (props) {
  const [approvedEditors, setApprovedEditors] = useState([])
  const [authToken, setAuthToken] = useState("")
  const [isAuth, setIsAuth] = useState(false)

  useEffect( () => {
    (async() => {
      const apiUrl = `https://www.googleapis.com/drive/v3/files/${DRIVE_ID}/permissions`
      const corporaParams = `includeItemsFromAllDrives=true&corpora=drive&supportsAllDrives=true`
      const url = `${apiUrl}?${corporaParams}&fields=*`

      const oauth = await getAccessToken()
      const oauthToken = oauth.access_token

      const result = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + oauthToken
        }
      })
      const jsonData = await result.json()

      let tmpArray = []
      for (const entry of jsonData.permissions) {
        if (entry.role === "organizer") {
          tmpArray.push(entry.emailAddress)
        }
      }

      setApprovedEditors(tmpArray)
    })()

  }, [])

  const handleLogIn = (token, email) => {
    if (approvedEditors.includes(email)) {
      setAuthToken(token)
      setIsAuth(true)
    } else {
      window.alert("Google account is not an approved editor! Log in under proper administrator account")
    }
  }

  const handleLogOut = () => {
    setIsAuth(false)
    setAuthToken("")

    window.location.reload()
  }

  return (
    <Router>
      <div className="App">

        <Header isAuth={isAuth} handleLogIn={handleLogIn} handleLogOut={handleLogOut} />

        <Switch>
          <Route exact path="/">
            <ListView isAuth={isAuth} authToken={authToken} />
          </Route>

          <Route path="/upload">
            <EditFileView isNewFile={true} isAuth={isAuth} authToken={authToken} />
          </Route>

          <Route exact path="/:fileID">
            <FileView isAuth={isAuth} authToken={authToken} />
          </Route>

          <Route exact path="/:fileID/edit">
            <EditFileView isAuth={isAuth} authToken={authToken} />
          </Route>
        </Switch>
        
      </div>
    </Router>
  )
}

export default App;
