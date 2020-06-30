import React, { useEffect, useState } from 'react'
import axios from 'axios'
import PostCard from '../components/PostCard'
import { Link } from 'react-router-dom'
import NavTop from '../components/NavTop'

const Home = () => {
  const [postList, setPostList] = useState([])
  useEffect(() => {
    const getData = async () => {
      const response = await axios.get('https://api-dev.paras.id/posts?mementoId__re=.act')
      setPostList(response.data.data)
    }
    getData()
  }, [])
  return (
    <div>
      <NavTop
        center={
          <h3 className="text-lg font-bold text-white">MOVE by Paras</h3>
        }
      />
      {
        postList.map(post => {
          return (
            <div className="mt-6">
              <PostCard post={post} />
            </div>
          )
        })
      }
      <div className="fixed bottom-0 left-0 right-0 pb-4">
        <div className="m-auto w-16">
          <Link className="inline-block" to="/new/post">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28Z" fill="#E13128" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M26.5292 38.6667V30.1375H18V26.5292H26.5292V18H30.1375V26.5292H38.6667V30.1375H30.1375V38.6667H26.5292Z" fill="white" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home