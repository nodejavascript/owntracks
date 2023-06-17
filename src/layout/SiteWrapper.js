import React from 'react'
import Background from './Background'

// import SiteHeader from './SiteHeader'
// import SiteFooter from './SiteFooter'

import { Space } from 'antd'

const SiteWrapper = ({ children }) => {
  return (
    <Background>
      <Space direction='vertical' size='large'>

        {children}

      </Space>
    </Background>
  )
}

export default SiteWrapper
