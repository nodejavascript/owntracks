
import dayjs from 'dayjs'

const returnKey = date => dayjs().unix() + Math.random()

export const processedRecords = payloads => payloads.filter(i => i.lat).map(record => processedRecord(record))

const lonLatDecimals = 5

export const processedRecord = payload => {
  const { lat, lon, alt, batt, bs } = payload

  let status = 'unknown'

  if (bs === 0) status = 'unknown'
  if (bs === 1) status = 'unplugged'
  if (bs === 2) status = 'charging'
  if (bs === 3) status = 'full'

  const record = {
    key: returnKey(),
    datetime: dayjs().format('YYYY-MM-DD HH:mm:ssZ'),
    lat: Number(lat.toFixed(lonLatDecimals)),
    lon: Number(lon.toFixed(lonLatDecimals)),
    alt,
    batt,
    status
  }

  return record
}
