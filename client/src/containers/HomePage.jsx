import React, { useState } from 'react'
import LoadingOverlay from 'react-loading-overlay'
import HashLoader from 'react-spinners/HashLoader'
import { toast } from 'react-toastify'

import ai from '../api/axios-instance'
import AvatarCard from '../components/AvatarCard'

const styles = {
  container: {
    width: '25vw',
  },
}

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = event => {
    event.preventDefault()

    setLoading(true)

    ai.post('/gameworlds', { email, password })
      .then(({ data }) => {
        setResponse(data)
        console.log(JSON.stringify(data, null, 2))
      })
      .catch(err => {
        console.log(err.response.data.errors)
        err.response.data.errors.forEach(error => toast.error(error))
      })
      .finally(() => setLoading(false))
  }

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
        }),
      }}>
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="flex flex-col" style={styles.container}>
          <div className="text-center">
            <p className="text-6xl font-hairline tracking-widest text-gray-300">
              tkjs
            </p>
          </div>
          <form onSubmit={onSubmitHandler} className="flex flex-col">
            <input
              className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 appearance-none leading-normal mb-2 placeholder-gray-900"
              type="email"
              placeholder="jane@example.com"
              onChange={e => setEmail(e.target.value)}
            />
            <input
              className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 appearance-none leading-normal mb-2 placeholder-gray-900"
              type="password"
              placeholder="password"
              onChange={e => setPassword(e.target.value)}
            />
            <input type="submit" value="login" hidden />
          </form>
          {response ? (
            response.avatarList.map(avatar => (
              <AvatarCard {...avatar.data} key={avatar.data.consumersId} />
            ))
          ) : (
            <p className="text-gray-300">There is no Avatar</p>
          )}
        </div>
      </div>
    </LoadingOverlay>
  )
}
