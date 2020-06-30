import 'regenerator-runtime/runtime'
import React, { Component, createRef, createContext, useContext, useState, useRef, useEffect } from 'react'
import * as faceapi from 'face-api.js'
import { createCanvas, loadImage } from 'canvas'
import axios from 'axios'
import Image from '../components/Image'
import { Link } from 'react-router-dom'
import NavTop from '../components/NavTop'
import Pop from '../components/Pop'

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
      <NavTop
        left={
          <Pop>
            <button className="flex items-center">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#F2F2F2" />
                <path fillRule="evenodd" clipRule="evenodd" d="M14.394 9.93934C14.9798 10.5251 14.9798 11.4749 14.394 12.0607L11.6213 14.8333H24C24.8284 14.8333 25.5 15.5049 25.5 16.3333C25.5 17.1618 24.8284 17.8333 24 17.8333H11.6213L14.394 20.606C14.9798 21.1918 14.9798 22.1415 14.394 22.7273C13.8082 23.3131 12.8585 23.3131 12.2727 22.7273L6.93934 17.394C6.65804 17.1127 6.5 16.7312 6.5 16.3333C6.5 15.9355 6.65804 15.554 6.93934 15.2727L12.2727 9.93934C12.8585 9.35355 13.8082 9.35355 14.394 9.93934Z" fill="#F2F2F2" />
              </svg>
            </button>
          </Pop>
        }
        center={
          <h3 className="text-lg font-bold text-white px-2">Select the MOVEMENT</h3>
        }
      />
      <div className="flex flex-wrap">
        {
          mementoList.map(memento => {
            return (
              <div className="w-1/2 p-4">
                <Link to={`/new/post/${memento.id}`}>
                  <div>
                    <Image data={memento.img} />
                    <h4 className="mt-2 text-white font-bold truncate overflow-hidden">{memento.id}</h4>
                  </div>
                </Link>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default NewPostMementoList