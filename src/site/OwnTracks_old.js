import React, { useEffect, useState } from 'react'
import { gql, useSubscription, useQuery } from '@apollo/client'

import dayjs from 'dayjs'

import { Heatmap, Liquid } from '@ant-design/plots'
import { Table, Typography } from 'antd'

const { Paragraph } = Typography

/*
  Owntracks docs
  https://owntracks.org/booklet/tech/json/

*/
const returnKey = date => dayjs().unix() + Math.random()

const SUBSCRIPTION_OWNTRACKS = gql`
  subscription subscribeOwnTracks {
    subMqttOwntracks 
  }
`
const QUERY_OWNTRACKS = gql`
  query queryMqttsubs {
    mqttsubs 
  }
`
const returnHeatMapRecord = payload => {
  const { lat, lon, alt, batt, bs } = payload

  let status = 'unknown'

  if (bs === 0) status = 'unknown'
  if (bs === 1) status = 'unplugged'
  if (bs === 2) status = 'charging'
  if (bs === 3) status = 'full'

  const current = {
    key: returnKey(),
    datetime: dayjs().format('YYYY-MM-DD HH:mm:ssZ'),
    lat: Number(lat.toFixed(5)),
    lon: Number(lon.toFixed(5)),
    alt,
    batt,
    status
  }
  return current
}

const locationCount = (heatMapData, lat, lon) => heatMapData.filter(i => i.lat === lat && i.lon === lon).length

const OwnTracks = () => {
  const { error, data } = useSubscription(SUBSCRIPTION_OWNTRACKS)
  const { error: queryerror, data: querydata } = useQuery(QUERY_OWNTRACKS)
  const [payload, setPayload] = useState()
  const [heatMapData, setHeatMapData] = useState([])
  const [heatMapDataProcessed, setHeatMapDataProcessed] = useState([])

  useEffect(() => {
    if (error || queryerror) console.error('error', error || queryerror)
  }, [error, queryerror])
  useEffect(() => {
    console.log('data')
  }, [data])

  useEffect(() => {
    if (heatMapData.length > 0) {
      const processed = heatMapData.map(record => {
        const { lat, lon } = record
        record.count = locationCount(heatMapData, lat, lon)
        record.percent = Number(record.count / heatMapData.length)
        record.display = Number((record.percent * 10).toFixed(0))
        return record
      })
      return setHeatMapDataProcessed(processed)
    }
  }, [heatMapData, setHeatMapDataProcessed])

  useEffect(() => {
    if (payload) {
      const current = returnHeatMapRecord(payload)
      return setHeatMapData([current, ...heatMapData])
    }
  }, [payload, heatMapData, setHeatMapData, returnHeatMapRecord])

  useEffect(() => {
    if (heatMapDataProcessed.length > 0 && data?.subMqttOwntracks) return setPayload(data.subMqttOwntracks.payload)
  }, [data, heatMapDataProcessed, setPayload])

  useEffect(() => {
    if (querydata?.mqttsubs) {
      const heatMapHistoryData = querydata.mqttsubs.map((i, index) => {
        const current = returnHeatMapRecord(i.payload)
        return current
      })

      return setHeatMapData(heatMapHistoryData)
    }
  }, [querydata, setHeatMapData, returnHeatMapRecord])

  const config = {
    data: heatMapDataProcessed,
    type: 'density',
    xField: 'lat',
    yField: 'lon',
    colorField: 'batt',
    style: {
      width: '100%',
      height: '800px'
    },
    color: '#F51D27-#FA541C-#FF8C12-#FFC838-#FAFFA8-#80FF73-#12CCCC-#1890FF-#6E32C2',
    legend: {
      position: 'bottom'
    }
  }

  const columns = [
    {
      title: 'datetime',
      dataIndex: 'datetime',
      key: 'datetime'
    }, {
      title: 'count',
      dataIndex: 'count',
      key: 'count'
    }, {
      title: 'display',
      dataIndex: 'display',
      key: 'display'
    }, {
      title: 'lat',
      dataIndex: 'lat',
      key: 'lat'
    }, {
      title: 'lon',
      dataIndex: 'lon',
      key: 'lon'
    }, {
      title: 'alt',
      dataIndex: 'alt',
      key: 'alt'
    }, {
      title: 'batt',
      dataIndex: 'batt',
      key: 'batt'
    }, {
      title: 'status',
      dataIndex: 'status',
      key: 'status'
    }
  ]

  const liquid = {
    percent: (payload ? payload.batt / 100 : 0),
    shape: 'rect',
    animation: Boolean(payload?.bs === 2),
    outline: {
      border: 2,
      distance: 4
    },
    wave: {
      length: 128
    }
  }

  return (
    <>
      <Paragraph>{JSON.stringify(payload, null, 4)}</Paragraph>
      <Liquid {...liquid} />

      <Table dataSource={heatMapDataProcessed} columns={columns} />
      <Heatmap {...config} />
    </>

  )
}

export default OwnTracks
