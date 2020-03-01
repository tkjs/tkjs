import React from 'react'

export default function AvatarCard(props) {
  const onClickHandler = e => {
    console.log('masuk')
  }

  return (
    <div
      onClick={onClickHandler}
      className="border border-blue-200 rounded-lg cursor-pointer hover:bg-gray-800 mb-2">
      <h1 className="text-gray-300 border-b border-blue-200 pt-1 mx-3 text-2xl font-hairline tracking-widest inline-block">
        {props.worldName}
      </h1>
      <h2 className="text-gray-300 py-2 mx-3 text-xl">{props.avatarName}</h2>
    </div>
  )
}
