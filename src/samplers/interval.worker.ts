/* eslint-disable no-restricted-globals */
import { interval } from '../helpers/eval'

self.onmessage = ({ data }) => {
  const d = data.d
  const xCoords = data.xCoords
  const nTask = data.nTask
  const samples = []
  for (let i = 0; i < xCoords.length - 1; i += 1) {
    const x = { lo: xCoords[i], hi: xCoords[i + 1] }
    const y = interval(d, 'fn', { x })
    if (y.lo > y.hi) {
      // is empty
      continue
    }
    if (y.lo === -Infinity && y.hi === Infinity) {
      // is whole
      samples.push(null)
      continue
    }
    samples.push([x, y])
  }
  self.postMessage({ samples, nTask })
}
