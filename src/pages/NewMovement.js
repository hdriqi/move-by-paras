import 'regenerator-runtime/runtime'
import React, { useState, useEffect, useRef } from 'react'
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
import Image from '../components/Image'

const NewMovement = ({ history }) => {
  const params = useParams()
  const near = useNear()
  const inputImgRef = useRef(null)
  const [img, setImg] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mementoId, setMementoId] = useState('')

  useEffect(() => {
    const id = `${name}.act`
    setMementoId(id)
  }, [name])

  const _validateSubmit = () => {
    if (imageFile && _validateName() && desc.length > 0 && desc.length < 400) {
      return true
    }
    return false
  }

  const _validateName = () => {
    if (name.length === 0) return true
    return name.match(/^[a-z0-9]{1,30}$/)
  }

  const _submit = async () => {
    setIsSubmitting(true)
    try {
      const exist = await near.contractParas.getMementoById({
        id: mementoId
      })

      if (exist) {
        alert('MOVEMENT already exist')
        setIsSubmitting(false)
        return
      }

      const newData = {
        name: name,
        img: null,
        desc: desc,
        category: 'act',
        type: 'public'
      }

      try {
        const img = await compressImg(imageFile)
        for await (const file of ipfs.client.add([{
          content: img
        }])) {
          newData.img = {
            url: file.path,
            type: 'ipfs'
          }
        }
        await near.contractParas.createMemento(newData)
        setTimeout(() => {
          setIsSubmitting(false)
          history.push('/new/post')
        }, 2500)
      } catch (err) {
        setIsSubmitting(false)
        alert('Something went wrong, try again later')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const _updateImg = (e) => {
    var reader = new FileReader()
    const file = e.target.files[0]
    reader.onload = () => {
      const dataURL = reader.result
      setImg(dataURL)
      setImageFile(file)
    }
    reader.readAsDataURL(file)
  }

  const updateCaption = (e) => {
    setDesc(e.target.value)
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
          <h3 className="text-lg font-bold text-white px-2">New MOVEMENT</h3>
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
        <input ref={inputImgRef} type="file" accept="image/*" onClick={(e) => { e.target.value = null }} onChange={e => _updateImg(e)} className="hidden" />
        <div className="mt-4">
          <div className="flex justify-between">
            <label className="block text-sm pb-1 font-semibold text-white">Image</label>
          </div>
          <div className="h-40 w-40 rounded-md relative overflow-hidden cursor-pointer">
            <div className="absolute inset-0 flex items-center justify-center opacity-50 bg-dark-0">
              <svg onClick={_ => inputImgRef.current.click()} className="cursor-pointer" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#E13128" />
                <path fillRule="evenodd" clipRule="evenodd" d="M11.8576 10.328C11.9155 10.2474 11.9799 10.1488 12.062 10.0158C12.092 9.96718 12.1738 9.83227 12.2347 9.7318L12.2347 9.73171L12.3033 9.6187C12.9816 8.50923 13.4746 8 14.3636 8H17.6364C18.5254 8 19.0184 8.50923 19.6967 9.6187L19.7654 9.7318C19.8262 9.83226 19.908 9.96718 19.938 10.0158C20.0201 10.1488 20.0844 10.2474 20.1425 10.328C20.1807 10.3812 20.214 10.4234 20.2413 10.4545H22.5455C23.9011 10.4545 25 11.5535 25 12.9091V20.2727C25 21.6284 23.9011 22.7273 22.5455 22.7273H9.45455C8.09894 22.7273 7 21.6284 7 20.2727V12.9091C7 11.5535 8.09894 10.4545 9.45455 10.4545H11.7587C11.7859 10.4234 11.8193 10.3812 11.8576 10.328ZM9.45455 12.0909C9.00268 12.0909 8.63636 12.4572 8.63636 12.9091V20.2727C8.63636 20.7246 9.00268 21.0909 9.45455 21.0909H22.5455C22.9973 21.0909 23.3636 20.7246 23.3636 20.2727V12.9091C23.3636 12.4572 22.9973 12.0909 22.5455 12.0909H20.0909C19.5474 12.0909 19.1808 11.7934 18.8141 11.2836C18.7297 11.1663 18.6461 11.0382 18.5454 10.8752C18.511 10.8193 18.4215 10.6717 18.3601 10.5703L18.3006 10.4722C17.9305 9.86686 17.7073 9.63636 17.6364 9.63636H14.3636C14.2927 9.63636 14.0695 9.86686 13.6994 10.4722L13.6399 10.5703L13.6396 10.5709C13.5782 10.6722 13.4889 10.8194 13.4545 10.8752C13.3539 11.0382 13.2703 11.1663 13.186 11.2836C12.8192 11.7934 12.4526 12.0909 11.9091 12.0909H9.45455ZM22.5455 13.7273C22.5455 14.1792 22.1792 14.5455 21.7273 14.5455C21.2754 14.5455 20.9091 14.1792 20.9091 13.7273C20.9091 13.2754 21.2754 12.9091 21.7273 12.9091C22.1792 12.9091 22.5455 13.2754 22.5455 13.7273ZM11.9091 16.1818C11.9091 18.4411 13.7407 20.2727 16 20.2727C18.2593 20.2727 20.0909 18.4411 20.0909 16.1818C20.0909 13.9225 18.2593 12.0909 16 12.0909C13.7407 12.0909 11.9091 13.9225 11.9091 16.1818ZM18.4545 16.1818C18.4545 17.5375 17.3556 18.6364 16 18.6364C14.6444 18.6364 13.5455 17.5375 13.5455 16.1818C13.5455 14.8262 14.6444 13.7273 16 13.7273C17.3556 13.7273 18.4545 14.8262 18.4545 16.1818Z" fill="white" />
              </svg>
            </div>
            {
              img && (
                <Image className="w-full h-full object-cover" data={img} />
              )
            }
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between">
            <label className="block text-sm pb-1 font-semibold text-white">Name</label>
          </div>
          <input type="text" placeholder="MOVEMENT name" className="w-full rounded-md p-2 outline-none bg-dark-2 focus:bg-dark-16 text-white" value={name} onChange={e => setName(e.target.value)} />
          {
            !_validateName() && (
              <div className="pt-1">
                <p className="text-primary-4 text-sm">MOVEMENT name must be lowercase and only contain letters and numbers</p>
              </div>
            )
          }
        </div>
        <div className="mt-4">
          <div className="flex justify-between">
            <label className="block text-sm pb-1 font-semibold text-white">Description</label>
          </div>
          <textarea placeholder="This MOVEMENT is about..." className="w-full resize-none h-32 rounded-md p-2 outline-none bg-dark-2 focus:bg-dark-16 text-white" value={desc} onChange={updateCaption} />
        </div>
      </div>
    </div >
  )
}

export default withRouter(NewMovement)