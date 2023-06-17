import React from 'react'

import { Heatmap } from '@ant-design/plots'

import { Card } from 'antd'

import uab from 'unique-array-objects'

const CoordMap = ({ processedData }) => {
  if (!processedData) return null

  const longLat = processedData.map(({ lat, lon }) => ({ lat, lon }))
  const uniqueLatLon = uab(longLat)

  const data = uniqueLatLon.map(i => {
    const dupes = processedData.filter(measurement => measurement.lat === i.lat && measurement.lon === i.lon)
    i.count = dupes?.length
    return i
  })

  // const xArray = data.map(i => i.lat)
  // const yArray = data.map(i => i.lon)

  // const xMin = Math.min(...xArray)
  // const xMax = Math.max(...xArray)
  // const xBorder = 0.5

  // const yMin = Math.min(...yArray)
  // const yMax = Math.max(...yArray)
  // const yBorder = 0.5

  const config = {
    data,
    type: 'density',
    xField: 'lat',
    yField: 'lon',
    colorField: 'count',
    style: {
      width: '100%',
      height: '600px'
    },
    color: ['#295599', '#3e94c0', '#78c6d0', '#b4d9e4', '#fffef0', '#f9cdac', '#ec7d92', '#bc448c'],

    radius: 15,
    intensity: 2
    // xAxis: {
    //   visible: true,
    //   min: xMin - xBorder,
    //   max: xMax + xBorder,
    //   nice: false
    // },
    // yAxis: {
    //   visible: true,
    //   min: yMin - yBorder,
    //   max: yMax + yBorder
    // }

  }

  return (
    <Card
      title='Heatmap'
      bordered
      hoverable
    >
      <Heatmap {...config} />
    </Card>
  )
}

export default CoordMap
