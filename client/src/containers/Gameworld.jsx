import React, { useEffect } from 'react'

import ai from '../api/axios-instance'
import errorMessage from '../utilities/error-message'

export default function Gameworld() {
  useEffect(() => {
    ai.get('/gameworlds/details')
      .then(({ data }) => {
        console.log(JSON.stringify(data, null, 2))
      })
      .catch(err => {
        errorMessage(err)
      })
  }, [])

  return (
    <div>
      <h1>Hello from gameworld</h1>
    </div>
  )
}
