import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Image from './Image'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import List from './List'
import { useNear } from '../App'

TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')

const PostCard = ({ post = {} }) => {
  const near = useNear()
  const [showModal, setShowModal] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)

  const imgUrl = `https://ipfs-gateway.paras.id/ipfs/${JSON.parse(post.contentList[0].body).url}`

  const _deletePost = async () => {
    const conf = confirm('Delete this post?')
    if (conf) {
      near.setIsSubmitting(true)
      await near.contractParas.deletePost({
        id: post.id
      })
      setIsDeleted(true)
      near.setIsSubmitting(false)
    }
  }

  if (isDeleted) {
    return null
  }

  return (
    <div>
      <List show={showModal} onClose={_ => setShowModal(false)}>
        <div className="p-2">
          <a className="text-white" href={imgUrl} download>Download Image</a>
        </div>
        <div className="p-2">
          <a className="text-white" onClick={_deletePost}>Delete</a>
        </div>
      </List>
      <div className="rounded-md overflow-hidden bg-dark-6">
        {
          post.mementoId.length > 0 && post.memento && (
            <div className="bg-dark-2 text-center p-2 flex justify-center">
              <Link to={`/m/${post.mementoId}`}>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-sm overflow-hidden">
                    <Image className="w-full h-full object-fill" data={post.memento.img} />
                  </div>
                  <h4 className="ml-2 font-bold text-white text-sm">{post.mementoId}</h4>
                </div>
              </Link>
            </div>
          )
        }
        <div>
          <Image data={JSON.parse(post.contentList[0].body)} />
        </div>
        <div className="p-2 flex justify-between">
          <div className="flex">
            <div className="h-8 w-8 rounded-full overflow-hidden shadow-inner flex-shrink-0">
              <Link to={`/${post.owner}`}>
                <div>
                  <Image className="object-fill" data={post.user.imgAvatar} />
                </div>
              </Link>
            </div>
            <div className="ml-2 mt-1">
              <div>
                <Link className="flex-shrink-0" to={`/${post.owner}`}>
                  <h4 className="text-white font-bold inline">{post.owner}</h4>
                </Link>
                {
                  post.contentList[1] && (
                    <p className="text-white-1 inline"> demands <em>{post.contentList[1]?.body}</em></p>
                  )
                }
              </div>
            </div>
          </div>
          <div>
            <button className="flex items-center" onClick={_ => setShowModal(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 12C20 13.1046 19.1046 14 18 14C16.8954 14 16 13.1046 16 12C16 10.8954 16.8954 10 18 10C19.1046 10 20 10.8954 20 12Z" fill="#E2E2E2" />
                <path d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" fill="#E2E2E2" />
                <path d="M8 12C8 13.1046 7.10457 14 6 14C4.89543 14 4 13.1046 4 12C4 10.8954 4.89543 10 6 10C7.10457 10 8 10.8954 8 12Z" fill="#E2E2E2" />
              </svg>
            </button>
          </div>
        </div>
        <div className="pt-0 p-2">
          <p className="text-white text-white-3 text-xs">
            {timeAgo.format(new Date(post.createdAt / (10 ** 6)))}
          </p>
        </div>
      </div>
    </div>
  )
}

export default PostCard