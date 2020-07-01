import React, { useEffect, useState } from 'react'
import NavTop from '../components/NavTop'
import Pop from '../components/Pop'
import Image from '../components/Image'
import PostCard from '../components/PostCard'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'
import InfiniteLoader from '../components/InfiniteLoader'

const Profile = () => {
  const params = useParams()
  const [user, setUser] = useState({})
  const [postList, setPostList] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [pageCount, setPageCount] = useState(0)

  const getPost = async () => {
    const ITEM_LIMIT = 10
    const response = await axios.get(`https://api-dev.paras.id/posts?owner=${params.userId}&__sort=-createdAt&__limit=${ITEM_LIMIT}&__skip=${pageCount * ITEM_LIMIT}`)
    if (response.data.data.length < ITEM_LIMIT) {
      setHasMore(false)
    }
    setPageCount(pageCount + 1)
    const newPostList = postList.slice().concat(response.data.data)
    setPostList(newPostList)
  }

  useEffect(() => {
    const getData = async () => {
      const responseMemento = await axios.get(`https://api-dev.paras.id/users?id=${params.userId}`)
      setUser(responseMemento.data.data[0])
      getPost()
    }
    getData()
  }, [])
  return (
    <div className="pb-24">
      <NavTop
        left={
          <Pop>
            <a>
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#F2F2F2" />
                <path fillRule="evenodd" clipRule="evenodd" d="M14.394 9.93934C14.9798 10.5251 14.9798 11.4749 14.394 12.0607L11.6213 14.8333H24C24.8284 14.8333 25.5 15.5049 25.5 16.3333C25.5 17.1618 24.8284 17.8333 24 17.8333H11.6213L14.394 20.606C14.9798 21.1918 14.9798 22.1415 14.394 22.7273C13.8082 23.3131 12.8585 23.3131 12.2727 22.7273L6.93934 17.394C6.65804 17.1127 6.5 16.7312 6.5 16.3333C6.5 15.9355 6.65804 15.554 6.93934 15.2727L12.2727 9.93934C12.8585 9.35355 13.8082 9.35355 14.394 9.93934Z" fill="#F2F2F2" />
              </svg>
            </a>
          </Pop>
        }
        center={
          <h3 className="text-lg font-bold text-white px-2">{user.id}</h3>
        }
      />
      <div className="mt-4">
        <Image className="w-40 h-40 rounded-sm m-auto object-contain" data={user.imgAvatar} />
        <div className="text-center mt-4">
          <h4 className="text-white font-bold">{user.id}</h4>
          <p className="text-white-2">{user.bio}</p>
        </div>
      </div>
      <div>
        <InfiniteScroll
          dataLength={postList.length}
          next={getPost}
          hasMore={hasMore}
          loader={<InfiniteLoader key={0} />}
        >
          {
            postList.map(post => {
              return (
                <div key={post.id} className="mt-6">
                  <PostCard post={post} />
                </div>
              )
            })
          }
        </InfiniteScroll>
      </div>
      <div className="fixed bottom-0 pb-4" style={{
        left: `50%`,
        transform: `translateX(-50%)`
      }}>
        <div className="m-auto w-16">
          <Link className="inline-block" to={`/new/post`}>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28Z" fill="#E13128" />
              <path fillRule="evenodd" clipRule="evenodd" d="M26.5292 38.6667V30.1375H18V26.5292H26.5292V18H30.1375V26.5292H38.6667V30.1375H30.1375V38.6667H26.5292Z" fill="white" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Profile