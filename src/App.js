import React from 'react'

import GraphqlClient from './GraphqlClient'
import OwnTracksInit from './site/OwnTracksInit.js'

const App = () => {
  return (
    <GraphqlClient>
      <div style={{ margin: 0, padding: 0, backgroundColor: 'magenta' }}>
        <div style={{ padding: 8 }}>

          <OwnTracksInit />

        </div>
      </div>
    </GraphqlClient>
  )
}

export default App
