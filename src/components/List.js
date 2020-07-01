import React from 'react'
import propType from 'prop-types'
import { useEffect } from 'react'

const List = ({ show, onClose, children }) => {
  useEffect(() => {
    const onKeydown = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    if (show) {
      document.addEventListener('keydown', onKeydown)
    }

    return () => {
      document.removeEventListener('keydown', onKeydown)
    }
  }, [show])

  const _bgClick = (e) => {
    if (e.target.id === 'confirm-modal-bg') {
      onClose()
    }
  }

  return (
    <div id="container-modal">
      {
        show ? (
          <div id="confirm-modal-bg" onClick={e => _bgClick(e)} className="fixed inset-0 z-40 flex items-center" style={{
            backgroundColor: `rgba(0,0,0,0.86)`
          }}>
            <div className="max-w-xs m-auto w-full p-4">
              <div className="bg-dark-1 w-full rounded-md overflow-hidden shadow-lg">
                {children}
              </div>
            </div>
          </div>
        ) : null
      }
    </div>
  )
}

List.propTypes = {
  show: propType.bool.isRequired,
  onClose: propType.func.isRequired
}

export default List