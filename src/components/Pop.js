import React, { Fragment, cloneElement } from 'react'
import { withRouter } from 'react-router-dom'

const Pop = ({ history, children }) => {
  const _navigate = () => {
    history.goBack()
  }

  return (
    <Fragment>
      { cloneElement(children, { onClick: e => {_navigate(e)} }) }
    </Fragment>
  )
}

export default withRouter(Pop)