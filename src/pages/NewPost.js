import 'regenerator-runtime/runtime'
import React, { useState, useEffect } from 'react'
import * as faceapi from 'face-api.js'
import { createCanvas, loadImage } from 'canvas'
import axios from 'axios'
import { useParams, withRouter } from 'react-router-dom'
import NavTop from '../components/NavTop'
import Pop from '../components/Pop'
import { RotateSpinLoader } from 'react-css-loaders'
import { compressImg } from '../utils/common'
import { useNear } from '../App'
import ipfs from '../utils/ipfs'

const NewPost = ({ history }) => {
  const params = useParams()
  const near = useNear()
  const [imageUrl, setImageUrl] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [caption, setCaption] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingImg, setLoadingImg] = useState(false)

  const _validateSubmit = () => {
    if (imageFile && caption.length < 400) {
      return true
    }
    return false
  }

  const _submit = async () => {
    setIsSubmitting(true)
    try {
      const contentList = []
      const img = await compressImg(imageFile)
      for await (const file of ipfs.client.add([{
        content: img
      }])) {
        const content = {
          type: 'img',
          body: JSON.stringify({
            url: file.path,
            type: 'ipfs'
          })
        }
        contentList.push(content)
      }
      if (caption.length > 0) {
        contentList.push({
          type: 'text',
          body: caption
        })
      }
      const newData = {
        contentList: contentList,
        mementoId: params.mementoId,
      }
      await near.contractParas.createPost(newData)
      history.push('/')
    } catch (err) {
      console.log(err)
    }
    setIsSubmitting(false)
  }

  const updateImg = (e) => {
    var reader = new FileReader()
    setLoadingImg('Detecting Faces...')
    reader.onload = () => {
      const dataURL = reader.result
      const imgEl = new Image()
      imgEl.src = dataURL
      imgEl.onload = async () => {
        const detections = await faceapi.detectAllFaces(imgEl)
        const faces = detections.map(x => ({
          x: x.box.topLeft.x,
          y: x.box.topLeft.y,
          w: x.box.width,
          h: x.box.height
        }))

        const outputCanvas = createCanvas(imgEl.width, imgEl.height)
        const outputCtx = outputCanvas.getContext('2d')

        const hiddenCanvas = createCanvas(imgEl.width, imgEl.height)
        const hiddenCtx = hiddenCanvas.getContext('2d')

        setLoadingImg('Pixelating Faces...')
        loadImage(dataURL).then(async (newImage) => {
          hiddenCanvas.style.cssText = 'image-rendering: optimizeSpeed' +
            'image-rendering: -moz-crisp-edges' + // FireFox
            'image-rendering: -o-crisp-edges' +  // Opera
            'image-rendering: -webkit-crisp-edges' + // Chrome
            'image-rendering: crisp-edges' + // Chrome
            'image-rendering: -webkit-optimize-contrast' + // Safari
            'image-rendering: pixelated ' + // Future browsers
            '-ms-interpolation-mode: nearest-neighbor' // IE
          // Use nearest-neighbor scaling when images are resized instead of the resizing algorithm to create blur
          hiddenCtx.webkitImageSmoothingEnabled = false
          hiddenCtx.mozImageSmoothingEnabled = false
          hiddenCtx.msImageSmoothingEnabled = false
          hiddenCtx.imageSmoothingEnabled = false

          // We'll be pixelating the image by threshold
          const percent = 0.15
          const scaledWidth = imgEl.width * percent
          const scaledHeight = imgEl.height * percent
          // Render image smaller
          hiddenCtx.drawImage(newImage, 0, 0, scaledWidth, scaledHeight)
          // Stretch the smaller image onto larger context
          hiddenCtx.drawImage(hiddenCanvas, 0, 0, scaledWidth, scaledHeight, 0, 0, imgEl.width, imgEl.height)

          // Clear visible canvas and draw original image to it
          outputCtx.clearRect(0, 0, imgEl.width, imgEl.height)
          outputCtx.drawImage(newImage, 0, 0)
          // Draw pixelated faces to canvas
          faces.forEach(face =>
            outputCtx.putImageData(
              hiddenCtx.getImageData(
                face.x,
                face.y,
                face.w,
                face.h
              ),
              face.x,
              face.y
            )
          )
          const dataUrl = await outputCanvas.toDataURL()
          setImageUrl(dataUrl)
          outputCanvas.toBlob((blob) => {
            setImageFile(blob)
          })
          setLoadingImg(false)
        })
      }
    }
    reader.readAsDataURL(e.target.files[0])
  }

  const updateCaption = (e) => {
    setCaption(e.target.value)
  }
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
          <h3 className="text-lg font-bold text-white px-2">New Post</h3>
        }
        right={
          isSubmitting ? (
            <RotateSpinLoader style={{
              marginLeft: `auto`,
              marginRight: 0
            }} color="#e13128" size={2.4} />
          ) : (
              <button disabled={!_validateSubmit()} onClick={_submit}>
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#E13128" />
                  <circle cx="16" cy="16" r="16" fill="#E13128" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M13.7061 19.2929L22.999 10L24.4132 11.4142L13.7061 22.1213L7.99902 16.4142L9.41324 15L13.7061 19.2929Z" fill="white" />
                </svg>
              </button>
            )
        }
      />
      <div>
        <div className="w-full relative pb-full mt-2 rounded-md overflow-hidden">
          {
            !loadingImg && (
              <input className="absolute m-auto w-full h-full z-10 opacity-0" type="file" onChange={updateImg} />
            )
          }
          <div className="absolute m-auto w-full h-full bg-dark-2 focus:bg-dark-16">
            {
              loadingImg ? (
                <div className="flex items-center h-full overflow-hidden">
                  <div className="w-full">
                    <RotateSpinLoader style={{
                      margin: 'auto'
                    }} color="#e13128" size={4} />
                    <p className="text-white-1 text-center mt-4">{loadingImg}</p>
                  </div>
                </div>
              ) : imageUrl ? (
                <div className="flex items-center h-full">
                  <img className="object-contain" src={imageUrl} />
                </div>
              ) : (
                    <div className="flex items-center h-full overflow-hidden">
                      <div className="w-full text-center">
                        <svg className="m-auto" width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M4 2H20C21.1046 2 22 2.89543 22 4V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V4C2 2.89543 2.89543 2 4 2ZM4 4V15.5858L8 11.5858L11.5 15.0858L18 8.58579L20 10.5858V4H4ZM4 20V18.4142L8 14.4142L13.5858 20H4ZM20 20H16.4142L12.9142 16.5L18 11.4142L20 13.4142V20ZM14 8C14 6.34315 12.6569 5 11 5C9.34315 5 8 6.34315 8 8C8 9.65685 9.34315 11 11 11C12.6569 11 14 9.65685 14 8ZM10 8C10 7.44772 10.4477 7 11 7C11.5523 7 12 7.44772 12 8C12 8.55228 11.5523 9 11 9C10.4477 9 10 8.55228 10 8Z" fill="white" />
                        </svg>
                        <p className="text-white-1 mt-4">Choose Image</p>
                      </div>
                    </div>
                  )
            }
          </div>
        </div>
        <div className="mt-2">
          <textarea placeholder="Your demand" className="w-full rounded-md p-2 outline-none bg-dark-2 focus:bg-dark-16 text-white" value={caption} onChange={updateCaption} />
        </div>
      </div>
    </div >
  )
}

export default withRouter(NewPost)