import { useEffect } from 'react'

import { message } from 'antd'

const LoadingOrError = ({ name, loading, error }) => {
  const loadingKey = name

  useEffect(() => {
    if (loading) {
      message.open({
        type: 'loading',
        content: name,
        key: loadingKey,
        duration: 0
      })
    }

    if (!loading) message.destroy(loadingKey)

    if (error) {
      message.open({
        type: 'error',
        content: error.message
      })
    }
  }, [loading, error])

  return null
}

export default LoadingOrError
