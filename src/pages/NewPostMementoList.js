import 'regenerator-runtime/runtime'
import React, { Component, createRef, createContext, useContext, useState, useRef, useEffect } from 'react'
import * as faceapi from 'face-api.js'
import { createCanvas, loadImage } from 'canvas'
import axios from 'axios'
import Image from '../components/Image'
import { Link } from 'react-router-dom'

const NewPostMementoList = () => {
  const [mementoList, setMementoList] = useState([])

  useEffect(() => {
    const init = async () => {
      const response = await axios.get(`https://api-dev.paras.id/mementos?id__re=.act`)
      setMementoList(response.data.data)
    }
    init()
  }, [])

  return (
    <div>
      <p>Select the MOVEMENT</p>
      {
        mementoList.map(memento => {
          return (
            <div>
              <Link to={`/new/post/${memento.id}`}>
                <div>
                  <Image data={memento.img} />
                  {memento.id}
                </div>
              </Link>
            </div>
          )
        })
      }
    </div>
  )
}

export default NewPostMementoList