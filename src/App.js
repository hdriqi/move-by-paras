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

const DEFAULT_AVATAR = [
  {
    url: 'QmWvmboVv5wgApgwPcVns3HF3FKpgXSezqtkrJoq5xriCH',
    type: 'ipfs'
  },
  {
    url: 'Qmab3Umre1GmXuSnkh9wxdr4QNSVtV8DBTLQBRPFbJbUUS',
    type: 'ipfs'
  },
  {
    url: 'QmfBxyRh5RwBAtB85Q6EGQEfNfprCDdz5mNu3HhLWynpo3',
    type: 'ipfs'
  },
  {
    url: 'QmRSFZvUwWD61wyYeuYC2B9Z8JPxXXHFmTHeGeRFi7Bn7L',
    type: 'ipfs'
  },
  {
    url: 'QmYBBFGBZV17oJb9HFQNB7EHmhDMo94GBPBdFnQEqSmF94',
    type: 'ipfs'
  },
  {
    url: 'QmcUhG6UjqUYKydg7KoAmTok4TSwRXhrvCLb5gciSzatig',
    type: 'ipfs'
  },
  {
    url: 'QmX6mc7wfDza8mDFMDGfmZsUQNZv1LhP8ztEURmHZf1xAF',
    type: 'ipfs'
  },
  {
    url: 'Qmdqg7bCjiKagvt421qhGdX5A6jXrAFVaUvxY6DwZMzLtE',
    type: 'ipfs'
  },
  {
    url: 'QmYeGSYCn14ppxnP26D5p9W8NRgPEBqkfkYfoAULCfKhyE',
    type: 'ipfs'
  },
  {
    url: 'QmQa68qLbW7iSSVNaS8o1rW9PiCYVoAneqn17D4oz6fbGu',
    type: 'ipfs'
  },
]

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
        let profile = await contractParas.getUserById({
          id: account.accountId
        })
        if (!profile) {
          const avatar = DEFAULT_AVATAR[Math.floor(Math.random() * DEFAULT_AVATAR.length)]
          try {
            profile = await near.contract.createUser({
              imgAvatar: avatar,
              bio: ''
            })
          } catch (err) {
            console.log(err)
          }
        }
        console.log(profile)
      }
      else {
        console.log('not logged in ')
      }
    }
    init()
  }, [])

  const value = { contract, contractParas, wallet, account }

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
