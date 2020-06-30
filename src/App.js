import 'regenerator-runtime/runtime'
import React, { createContext, useContext, useEffect, useState } from 'react'
import * as faceapi from 'face-api.js'
import './assets/main.css'
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom'
import Home from './pages/Home'
import NewPost from './pages/NewPost'
import Login from './pages/Login'
import NewPostMementoList from './pages/NewPostMementoList'
import ipfs from './utils/ipfs'

const MODEL_URL = `http://127.0.0.1:8080/models`

const AppContext = createContext()
export const useNear = () => useContext(AppContext)

const App = ({ contract, contractParas, wallet, account }) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      await ipfs.init()
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
      setLoading(false)
      if (wallet.isSignedIn()) {
        const profile = await contractParas.getUserById({
          id: account.accountId
        })
        console.log(profile)
      }
      else {
        console.log('not logged in ')
      }
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
      <div className="max-w-xl m-auto">
        <Router>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/new/post" exact>
              <NewPostMementoList />
            </Route>
            <Route path="/new/post/:mementoId">
              <NewPost />
            </Route>
            <Route path="/login" exact>
              <Login />
            </Route>
          </Switch>
        </Router>
      </div>
    </AppContext.Provider>
  )
}

export default App;
