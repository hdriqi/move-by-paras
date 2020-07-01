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
import { RotateSpinLoader } from 'react-css-loaders'

const MODEL_URL = `/models`

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

const App = ({ contractParas, wallet, account }) => {
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [me, setMe] = useState(null)

  useEffect(() => {
    const init = async () => {
      await ipfs.init()
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)

      if (wallet.isSignedIn()) {
        let profile = await contractParas.getUserById({
          id: account.accountId
        })
        if (!profile) {
          const avatar = DEFAULT_AVATAR[Math.floor(Math.random() * DEFAULT_AVATAR.length)]
          try {
            profile = await contractParas.createUser({
              imgAvatar: avatar,
              bio: ''
            })
          } catch (err) {
            console.log(err)
          }
        }
        setMe(profile)
      }
      else {
        console.log('not logged in ')
      }
      setLoading(false)
    }
    init()
  }, [])

  const value = { contractParas, wallet, account, setIsSubmitting, me }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center overflow-hidden">
        <div>
          <svg width="100" height="70" viewBox="0 0 94 57" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.429688 1.09375H6.10156L11.1406 15.1562L16.1328 1.04688H21.8516V31H17V9.29688L12.8281 20.5938H9.26562L5.23438 9.29688V31H0.429688V1.09375Z" fill="white" />
            <path d="M35.1406 31.8672C32.7812 31.8672 30.75 31.2422 29.0469 29.9922C27.3594 28.7266 26.0625 26.9062 25.1562 24.5312C24.2656 22.1406 23.8203 19.2891 23.8203 15.9766C23.8203 12.7109 24.2656 9.90625 25.1562 7.5625C26.0625 5.21875 27.3594 3.42969 29.0469 2.19531C30.75 0.945312 32.7812 0.320312 35.1406 0.320312C37.5 0.320312 39.5234 0.945312 41.2109 2.19531C42.9141 3.42969 44.2109 5.21875 45.1016 7.5625C46.0078 9.90625 46.4609 12.7109 46.4609 15.9766C46.4609 19.2891 46.0078 22.1406 45.1016 24.5312C44.2109 26.9062 42.9141 28.7266 41.2109 29.9922C39.5234 31.2422 37.5 31.8672 35.1406 31.8672ZM35.1406 27.5547C36.3281 27.5547 37.3516 27.0703 38.2109 26.1016C39.0859 25.1172 39.75 23.7344 40.2031 21.9531C40.6719 20.1562 40.9062 18.0703 40.9062 15.6953C40.9062 13.4922 40.6719 11.5625 40.2031 9.90625C39.75 8.23438 39.0859 6.94531 38.2109 6.03906C37.3516 5.11719 36.3281 4.65625 35.1406 4.65625C33.9688 4.65625 32.9453 5.11719 32.0703 6.03906C31.1953 6.94531 30.5234 8.23438 30.0547 9.90625C29.6016 11.5625 29.375 13.4922 29.375 15.6953C29.375 18.0703 29.6016 20.1562 30.0547 21.9531C30.5234 23.7344 31.1875 25.1172 32.0469 26.1016C32.9219 27.0703 33.9531 27.5547 35.1406 27.5547Z" fill="white" />
            <path d="M47.4688 1.09375H53.1406L59.4219 22.3047L65.375 1.09375H70.9062L61.2969 31H57.1719L47.4688 1.09375Z" fill="white" />
            <path d="M73.6953 1.09375H93.1719V5.71094H78.9219V13.0938H90.7344V17.8047H78.9219V26.3828H93.0781V31H73.6953V1.09375Z" fill="white" />
            <path d="M5.38672 52.3633C4.81641 52.3633 4.27344 52.2383 3.75781 51.9883C3.24219 51.7383 2.80078 51.3828 2.43359 50.9219L2.07031 52H0.195312V35.8047H3.07812V36.0742C2.99219 36.168 2.9375 36.2734 2.91406 36.3906C2.89062 36.5 2.88281 36.6875 2.89062 36.9531V41.7578C3.23438 41.375 3.63281 41.0781 4.08594 40.8672C4.54688 40.6562 5.01172 40.5508 5.48047 40.5508C6.33984 40.5508 7.12891 40.7656 7.84766 41.1953C8.56641 41.6172 9.13672 42.25 9.55859 43.0938C9.98828 43.9375 10.2031 44.9609 10.2031 46.1641C10.2031 47.4766 9.97266 48.6016 9.51172 49.5391C9.05859 50.4766 8.46094 51.1836 7.71875 51.6602C6.98438 52.1289 6.20703 52.3633 5.38672 52.3633ZM5.04688 50.125C5.44531 50.125 5.82812 50.0039 6.19531 49.7617C6.57031 49.5195 6.87891 49.1289 7.12109 48.5898C7.37109 48.0508 7.49609 47.3633 7.49609 46.5273C7.49609 45.3867 7.28516 44.4688 6.86328 43.7734C6.44141 43.0781 5.8125 42.7305 4.97656 42.7305C4.17969 42.7305 3.62891 43.0508 3.32422 43.6914C3.01953 44.3242 2.86719 45.1836 2.86719 46.2695C2.86719 47.6133 3.05469 48.5938 3.42969 49.2109C3.80469 49.8203 4.34375 50.125 5.04688 50.125Z" fill="#E2E2E2" />
            <path d="M21.8984 40.7969C21.875 41.4375 21.7734 42.0898 21.5938 42.7539C21.4141 43.4102 21.1562 44.1953 20.8203 45.1094L18.0312 52.7969C17.5781 54.0391 17.0234 54.9219 16.3672 55.4453C15.7188 55.9766 14.9297 56.2422 14 56.2422C13.4766 56.2422 13.0039 56.1523 12.582 55.9727C12.168 55.8008 11.7188 55.5234 11.2344 55.1406L12.1133 53.2188L12.207 53.0195L12.4531 53.1367C12.4688 53.168 12.4922 53.2344 12.5234 53.3359C12.5625 53.4375 12.625 53.5312 12.7109 53.6172C12.7969 53.7109 12.9062 53.8008 13.0391 53.8867C13.3359 54.082 13.6328 54.1797 13.9297 54.1797C14.3203 54.1797 14.6875 53.9844 15.0312 53.5938C15.375 53.2031 15.6914 52.6562 15.9805 51.9531L11.7383 40.7969H14.3633L17.1758 48.6602L18.6289 44.6523C18.8633 43.9258 19.0391 43.2891 19.1562 42.7422C19.2812 42.1953 19.3438 41.6562 19.3438 41.125C19.3438 40.9766 19.3398 40.8672 19.332 40.7969H21.8984Z" fill="#E2E2E2" />
            <path d="M36.1953 37.0469H41.2695C42.4102 37.0469 43.3555 37.2461 44.1055 37.6445C44.8555 38.043 45.4102 38.582 45.7695 39.2617C46.1289 39.9336 46.3086 40.6914 46.3086 41.5352C46.3086 42.3789 46.1328 43.1328 45.7812 43.7969C45.4297 44.4609 44.8867 44.9883 44.1523 45.3789C43.418 45.7617 42.4961 45.9531 41.3867 45.9531H38.9375V52H36.1953V37.0469ZM41.1875 43.668C41.9844 43.668 42.5742 43.4805 42.957 43.1055C43.3477 42.7305 43.543 42.2305 43.543 41.6055C43.543 40.9492 43.3438 40.4219 42.9453 40.0234C42.5547 39.625 41.9766 39.4258 41.2109 39.4258H38.9375V43.668H41.1875Z" fill="#E2E2E2" />
            <path d="M52.7305 40.4336C54.207 40.4336 55.3867 40.8008 56.2695 41.5352C57.1602 42.2695 57.6055 43.4844 57.6055 45.1797V52H55.0391V50.9922C54.6094 51.3984 54.0898 51.7188 53.4805 51.9531C52.8789 52.1797 52.2305 52.293 51.5352 52.293C50.3711 52.293 49.4844 52.0078 48.875 51.4375C48.2656 50.8594 47.9609 50.0781 47.9609 49.0938C47.9609 48.2969 48.2109 47.6172 48.7109 47.0547C49.2188 46.4922 49.9453 46.0664 50.8906 45.7773C51.8438 45.4805 52.9805 45.332 54.3008 45.332H55.1211C55.043 44.3555 54.8047 43.6602 54.4062 43.2461C54.0078 42.8242 53.4023 42.6133 52.5898 42.6133C52.0742 42.6133 51.5391 42.75 50.9844 43.0234C50.4297 43.2891 49.918 43.6641 49.4492 44.1484L48.0781 42.3789C48.7812 41.7383 49.5352 41.2539 50.3398 40.9258C51.1523 40.5977 51.9492 40.4336 52.7305 40.4336ZM52.4023 50.2422C53.1992 50.2422 53.8281 49.9922 54.2891 49.4922C54.75 48.9922 55.0273 48.2031 55.1211 47.125H54.582C53.207 47.125 52.2031 47.2734 51.5703 47.5703C50.9375 47.8672 50.6211 48.3359 50.6211 48.9766C50.6211 49.4141 50.7773 49.7344 51.0898 49.9375C51.4102 50.1406 51.8477 50.2422 52.4023 50.2422Z" fill="#E2E2E2" />
            <path d="M67.1328 40.5508C67.6875 40.5508 68.2383 40.6562 68.7852 40.8672C69.3398 41.0703 69.832 41.375 70.2617 41.7812L68.9727 44.3594L68.7266 44.2422C68.7109 44.1875 68.6953 44.1094 68.6797 44.0078C68.6562 43.8594 68.6211 43.7344 68.5742 43.6328C68.5352 43.5234 68.4492 43.4141 68.3164 43.3047C67.9258 42.9922 67.4453 42.8359 66.875 42.8359C66.3047 42.8359 65.7891 42.9727 65.3281 43.2461C64.8672 43.5117 64.5039 43.8945 64.2383 44.3945C63.9805 44.8945 63.8516 45.4766 63.8516 46.1406V52H61.1328V40.7969H63.8984V42.4023C64.1953 41.8242 64.6289 41.3711 65.1992 41.043C65.7773 40.7148 66.4219 40.5508 67.1328 40.5508Z" fill="#E2E2E2" />
            <path d="M76.7305 40.4336C78.207 40.4336 79.3867 40.8008 80.2695 41.5352C81.1602 42.2695 81.6055 43.4844 81.6055 45.1797V52H79.0391V50.9922C78.6094 51.3984 78.0898 51.7188 77.4805 51.9531C76.8789 52.1797 76.2305 52.293 75.5352 52.293C74.3711 52.293 73.4844 52.0078 72.875 51.4375C72.2656 50.8594 71.9609 50.0781 71.9609 49.0938C71.9609 48.2969 72.2109 47.6172 72.7109 47.0547C73.2188 46.4922 73.9453 46.0664 74.8906 45.7773C75.8438 45.4805 76.9805 45.332 78.3008 45.332H79.1211C79.043 44.3555 78.8047 43.6602 78.4062 43.2461C78.0078 42.8242 77.4023 42.6133 76.5898 42.6133C76.0742 42.6133 75.5391 42.75 74.9844 43.0234C74.4297 43.2891 73.918 43.6641 73.4492 44.1484L72.0781 42.3789C72.7812 41.7383 73.5352 41.2539 74.3398 40.9258C75.1523 40.5977 75.9492 40.4336 76.7305 40.4336ZM76.4023 50.2422C77.1992 50.2422 77.8281 49.9922 78.2891 49.4922C78.75 48.9922 79.0273 48.2031 79.1211 47.125H78.582C77.207 47.125 76.2031 47.2734 75.5703 47.5703C74.9375 47.8672 74.6211 48.3359 74.6211 48.9766C74.6211 49.4141 74.7773 49.7344 75.0898 49.9375C75.4102 50.1406 75.8477 50.2422 76.4023 50.2422Z" fill="#E2E2E2" />
            <path d="M89.3633 52.3867C88.2383 52.3867 87.2578 52.2383 86.4219 51.9414C85.5859 51.6367 84.8203 51.1523 84.125 50.4883L85.25 48.5195L85.3555 48.332L85.5898 48.4727C85.6055 48.5117 85.625 48.582 85.6484 48.6836C85.6797 48.7852 85.7305 48.8867 85.8008 48.9883C85.8789 49.082 85.9805 49.1758 86.1055 49.2695C86.543 49.5977 87.0234 49.8398 87.5469 49.9961C88.0781 50.1445 88.6914 50.2188 89.3867 50.2188C90.668 50.2188 91.3086 49.7969 91.3086 48.9531C91.3086 48.6953 91.2305 48.4727 91.0742 48.2852C90.918 48.0977 90.668 47.9258 90.3242 47.7695C89.9805 47.6133 89.5078 47.4492 88.9062 47.2773C87.6172 46.9414 86.6133 46.5195 85.8945 46.0117C85.1836 45.4961 84.8281 44.7891 84.8281 43.8906C84.8281 43.2422 85 42.668 85.3438 42.168C85.6953 41.6602 86.1953 41.2656 86.8438 40.9844C87.5 40.6953 88.2656 40.5508 89.1406 40.5508C90.0156 40.5508 90.8125 40.6953 91.5312 40.9844C92.2578 41.2656 92.9258 41.6992 93.5352 42.2852L92.1758 44.1719L92.0586 44.3477L91.8359 44.1953C91.8281 44.1562 91.8125 44.0859 91.7891 43.9844C91.7734 43.875 91.7305 43.7695 91.6602 43.668C91.5898 43.5664 91.4922 43.4727 91.3672 43.3867C90.7344 42.9336 90.0078 42.707 89.1875 42.707C88.7109 42.707 88.3125 42.7891 87.9922 42.9531C87.6719 43.1172 87.5117 43.3398 87.5117 43.6211C87.5117 43.8789 87.5977 44.1016 87.7695 44.2891C87.9492 44.4688 88.2148 44.6328 88.5664 44.7812C88.9258 44.9297 89.4375 45.1055 90.1016 45.3086C91.0234 45.5898 91.7461 45.875 92.2695 46.1641C92.793 46.4453 93.1758 46.7852 93.418 47.1836C93.6602 47.582 93.7812 48.082 93.7812 48.6836C93.7812 49.332 93.5859 49.9414 93.1953 50.5117C92.8125 51.0742 92.2852 51.5273 91.6133 51.8711C90.9414 52.2148 90.1914 52.3867 89.3633 52.3867Z" fill="#E2E2E2" />
          </svg>
          <div className="mt-8">
            <RotateSpinLoader style={{
              margin: `auto`
            }} color="#e13128" size={6} />
          </div>
        </div>
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
            <Route path="/login" exact>
              <Login />
            </Route>
            <Route path="/m/:mementoId" exact>
              <Movement />
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
            <Route path="/:userId" exact>
              <Profile />
            </Route>
          </Switch>
        </Router>
      </div>
    </AppContext.Provider>
  )
}

export default App;
