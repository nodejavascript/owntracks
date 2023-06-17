import React from 'react'

import { Liquid } from '@ant-design/plots'

import { Card } from 'antd'

const Battery = ({ processedData }) => {
  if (!processedData) return null

  const { status, batt } = processedData[0]

  const animation = Boolean(status === 'charging')

  const liquid = {
    percent: batt / 100,
    shape: 'rect',
    animation,
    outline: {
      border: 1,
      distance: 4
    }
  }

  return (
    <Card
      title='Battery'
      extra={status}
    >
      <Liquid {...liquid} />
    </Card>
  )
}

export default Battery
