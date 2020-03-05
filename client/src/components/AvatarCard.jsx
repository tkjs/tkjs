import React, { useState } from 'react'
import LoadingOverlay from 'react-loading-overlay'
import HashLoader from 'react-spinners/HashLoader'

import errorMessage from '../utilities/error-message'
import ai from '../api/axios-instance'

export default function AvatarCard(props) {
  const [loading, setLoading] = useState(false)

  const onClickHandler = e => {
    setLoading(true)

    ai.post('/gameworlds/login', {
      gameworldId: props.consumersId,
      worldName: props.worldName,
    })
      .then(({ data }) => {
        console.log(data)
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
        errorMessage(err)
      })
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
          width: '100vw',
        }),
      }}>
      <div className="w-screen h-screen flex justify-center items-center">
        <div
          onClick={onClickHandler}
          className={`
          border border-blue-200 rounded-lg 
          cursor-pointer 
          hover:bg-gray-800 mb-2
        `}>
          <h1
            className={`
            text-gray-300 
            border-b border-blue-200 
            pt-1 mx-3 text-2xl font-hairline tracking-widest 
            inline-block
          `}>
            {props.worldName}
          </h1>
          <h2 className="text-gray-300 py-2 mx-3 text-xl">
            {props.avatarName}
          </h2>
        </div>
      </div>
    </LoadingOverlay>
  )
}
