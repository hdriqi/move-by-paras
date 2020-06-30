import React, { useEffect, useState } from 'react'
import axios from 'axios'
import PostCard from '../components/PostCard'

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
      {
        postList.map(post => {
          return (
            <div>
              <PostCard post={post} />
            </div>
          )
        })
      }
    </div>
  )
}

export default Home