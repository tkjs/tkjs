import React, { useState, useEffect } from 'react'
import LoadingOverlay from 'react-loading-overlay'
import HashLoader from 'react-spinners/HashLoader'

import AvatarCard from '../components/AvatarCard'
import ai from '../api/axios-instance'
import errorMessage from '../utilities/error-message'

export default function Lobby() {
  const [loading, setLoading] = useState(true)
  const [avatarList, setAvatarList] = useState([])

  useEffect(() => {
    ai.get('/lobby/avatar-list')
      .then(({ data }) => {
        setLoading(false)
        setAvatarList(data.avatarList)
      })
      .catch(err => {
        setLoading(false)
        errorMessage(err)
      })
  }, [])

  return (
    <LoadingOverlay
      className="absolute"
      active={loading}
      spinner={<HashLoader color="white" css="margin: 1rem auto;" />}
      text="Loading..."
      styles={{
        overlay: base => ({
          ...base,
          background: 'rgba(0, 0, 0, 0.9)',
          height: '100vh',
          width: '100vw',
        }),
      }}>
      <div className="w-screen h-screen flex justify-center items-center">
        {avatarList.map(avatar => (
          <AvatarCard {...avatar} key={avatar.consumersId} />
        ))}
      </div>
    </LoadingOverlay>
  )
}
