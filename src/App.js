import 'regenerator-runtime/runtime'
import React, { createContext, useContext, useEffect, useState } from 'react'
import * as faceapi from 'face-api.js'
import './assets/main.css'
import { BrowserRouter as Router, Switch, Route, useHistory, Link } from 'react-router-dom'
import Home from './pages/Home'
import NewPost from './pages/NewPost'
import Login from './pages/Login'
import NewPostMementoList from './pages/NewPostMementoList'
import ipfs from './utils/ipfs'
import NewMovement from './pages/NewMovement'
import Movement from './pages/Movement'
import Profile from './pages/Profile'

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
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const value = { contract, contractParas, wallet, account, setIsSubmitting }

  if (loading) {
    return (
      <div>
        Loading
      </div>
    )
  }

  return (
    <AppContext.Provider value={value}>
      {
        isSubmitting && (
          <div className="fixed inset-0 z-50 flex items-center" style={{
            backgroundColor: `rgba(0,0,0,0.86)`
          }}>
            <div className="max-w-xs m-auto w-full p-4">
              <svg className="rotate-z m-auto" width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M4.28572 39.9438H9.9012L8.47263 28.9771C14.4579 29.839 27.1429 30.1897 30 24.6974C32.8571 30.1897 45.5421 29.839 51.5274 28.9771L50.0988 39.9438H55.7143L60 0L44.331 4.2797C39.0778 5.58738 30 9.73631 30 15.8705C30 9.73631 20.9222 5.58738 15.669 4.2797L0 0L4.28572 39.9438ZM7.85703 5.25234C13.5713 6.67891 25.8376 11.8145 28.6948 20.9446C25.6597 25.4907 19.4788 25.3418 15.6509 25.2477C15.1546 25.2355 14.6957 25.2243 14.2857 25.2243C6.42858 25.2243 7.53768 6.48246 7.85703 5.25234ZM52.143 5.25235C46.4287 6.67892 34.1624 11.8145 31.3053 20.9446C34.3404 25.4907 40.5212 25.3418 44.3491 25.2477C44.8455 25.2355 45.3043 25.2243 45.7143 25.2243C53.5714 25.2243 52.4623 6.48246 52.143 5.25235Z" fill="white" />
              </svg>
              <p className="text-white text-center mt-4">Loading...</p>
            </div>
          </div>
        )
      }

      <div className="max-w-xl m-auto">
        <Router>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/m/:mementoId" exact>
              <Movement />
            </Route>
            <Route path="/:userId" exact>
              <Profile />
            </Route>
            <Route path="/new/post" exact>
              <NewPostMementoList />
            </Route>
            <Route path="/new/movement" exact>
              <NewMovement />
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
