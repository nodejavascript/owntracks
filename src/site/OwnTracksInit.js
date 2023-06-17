import React, { useEffect, useState } from 'react'

import { gql, useQuery } from '@apollo/client'

import OwnTracksSub from './OwnTracksSub'
import LoadingOrError from '../components/LoadingOrError'

const QUERY_OWNTRACKS = gql`
  query queryMqttsubs ($mqttsubsInput: MqttsubsInput!) {
    mqttsubs (mqttsubsInput: $mqttsubsInput)
  }
`
const limit = 1000

const OwnTracksInit = () => {
  const { error, data, loading } = useQuery(QUERY_OWNTRACKS, { variables: { mqttsubsInput: { limit } } })
  const [history, setHistory] = useState()

  useEffect(() => {
    if (data?.mqttsubs) return setHistory(data.mqttsubs)
  }, [data, setHistory])

  return (
    <>
      <LoadingOrError name='OwnTracksInit' loading={loading} error={error} />
      <OwnTracksSub history={history} />
    </>
  )
}

export default OwnTracksInit
