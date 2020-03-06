import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import LoadingOverlay from 'react-loading-overlay'
import HashLoader from 'react-spinners/HashLoader'
import { toast } from 'react-toastify'

import ai from '../api/axios-instance'
import errorMessage from '../utilities/error-message'

const styles = {
  container: {
    width: '25vw',
  },
}

export default function HomePage() {
  const [credential, setCredential] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(true)
  const history = useHistory()

  const onSubmitHandler = event => {
    event.preventDefault()

    const errors = []

    if (!credential.email) errors.push('Email is required')
    if (!credential.password) errors.push('Password is required')

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error))
      return
    }

    setLoading(true)

    ai.post('/lobby/login', {
      email: credential.email,
      password: credential.password,
    })
      .then(({ data }) => {
        setLoading(false)
        history.push('/lobby')
      })
      .catch(err => {
        setLoading(false)
        errorMessage(err)
      })
  }

  useEffect(() => {
    ai.get('/lobby')
      .then(({ data }) => {
        if (data.lobbySession) {
          setLoading(false)
          history.push('/lobby')
          return
        } else setLoading(false)
      })
      .catch(err => {
        setLoading(false)
        errorMessage(err)
      })
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
              className={`
                border 
                rounded 
                bg-white 
                leading-normal 
                py-2 px-4 mb-2 
                appearance-none 
                border-gray-300 
                placeholder-gray-900
                focus:outline-none 
                focus:shadow-outline 
              `}
              type="email"
              placeholder="jane@example.com"
              onChange={e =>
                setCredential({ ...credential, email: e.target.value })
              }
              autoFocus
            />
            <input
              className={`
                border 
                rounded 
                bg-white 
                leading-normal 
                py-2 px-4 mb-2
                appearance-none 
                border-gray-300 
                placeholder-gray-900
                focus:outline-none 
                focus:shadow-outline 
              `}
              type="password"
              placeholder="password"
              onChange={e =>
                setCredential({ ...credential, password: e.target.value })
              }
            />
            <input type="submit" value="login" hidden />
          </form>
          <small className="text-gray-300 italic text-xs">
            Press enter for submit
          </small>
        </div>
      </div>
    </LoadingOverlay>
  )
}
