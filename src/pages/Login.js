import React, { useEffect } from 'react'
import { useNear } from '../App'
import { withRouter } from 'react-router-dom'

const Login = ({ history }) => {
  const near = useNear()

  useEffect(() => {
    if (near.wallet.isSignedIn()) {
      history.replace('/')
    }
  }, [])

  const login = async () => {
    const appTitle = 'Move by Paras'
    await near.wallet.requestSignIn(
      'contract-alpha.paras.testnet',
      appTitle
    )
  }

  return (
    <div>
      <button className="w-full rounded-md p-2 bg-primary-5 text-white font-semibold" onClick={login}>Login</button>
    </div>
  )
}

export default withRouter(Login)