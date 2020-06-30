import 'regenerator-runtime/runtime'
import React, { createContext, useContext, useEffect, useState } from 'react'
import * as faceapi from 'face-api.js'
import './assets/main.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './pages/Home'
import NewPost from './pages/NewPost'

const MODEL_URL = `http://127.0.0.1:8080/models`

const AppContext = createContext()
export const useApp = () => useContext(AppContext)

const App = ({ contract, wallet, account }) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
      setLoading(false)
    }
    init()
  }, [])

  const value = { contract, wallet, account }

  if (loading) {
    return (
      <div>
        Loading
      </div>
    )
  }

  return (
    <AppContext.Provider value={value}>
      <Router>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/new/post" exact>
            <NewPost />
          </Route>
        </Switch>
      </Router>
    </AppContext.Provider>
  )
}

export default App;
