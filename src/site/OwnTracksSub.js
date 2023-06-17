import React, { useEffect, useState } from 'react'
import { gql, useSubscription } from '@apollo/client'

import { processedRecords, processedRecord } from './utils'

import LoadingOrError from '../components/LoadingOrError'
import Battery from './Battery'
import CoordMap from './CoordMap'

import { Space } from 'antd'

const SUBSCRIPTION_OWNTRACKS = gql`
  subscription subscribeOwnTracks {
    subMqttOwntracks 
  }
`

const OwnTracksSub = ({ history }) => {
  const { error, data, loading } = useSubscription(SUBSCRIPTION_OWNTRACKS)
  const [processedData, setProcessedData] = useState()

  useEffect(() => {
    if (history) {
      const payloads = history.map(i => i.payload)
      const records = processedRecords(payloads)
      setProcessedData(records)
    }
  }, [history, setProcessedData])

  useEffect(() => {
    if (!data?.subMqttOwntracks) return

    const payload = processedRecord(data.subMqttOwntracks.payload)

    addData(payload)
  }, [data])

  const addData = payload => {
    const newProcessedData = [payload, ...processedData]

    setProcessedData(newProcessedData)
  }

  return (
    <Space direction='vertical' style={{ display: 'flex' }}>
      <LoadingOrError name='Waiting for sub' loading={loading} error={error} />
      <CoordMap processedData={processedData} />
      <Battery processedData={processedData} />
    </Space>
  )
}

export default OwnTracksSub
