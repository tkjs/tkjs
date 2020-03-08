import React, { useState, useEffect } from 'react'
import LoadingOverlay from 'react-loading-overlay'
import HashLoader from 'react-spinners/HashLoader'
import { useHistory } from 'react-router-dom'

import ai from '../api/axios-instance'
import AvatarCard from '../components/AvatarCard'
import errorMessage from '../utilities/error-message'

export default function Lobby() {
  const [loading, setLoading] = useState(true)
  const [avatarList, setAvatarList] = useState([])
  const history = useHistory()

  useEffect(() => {
    const main = async () => {
      try {
        const { data } = await ai.get('/gameworlds')
        if (data.status === 'Logged In') {
          setLoading(false)
          history.push('/gameworld')
        } else {
          const { data: response } = await ai.get('/lobby/avatar-list')
          setLoading(false)
          setAvatarList(response.avatarList)
        }
      } catch (err) {
        setLoading(false)
        errorMessage(err)
      }
    }

    main()
  }, [history])

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
          <AvatarCard
            {...avatar}
            key={avatar.consumersId}
            setLoading={val => setLoading(val)}
          />
        ))}
      </div>
    </LoadingOverlay>
  )
}
