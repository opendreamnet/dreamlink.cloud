import { IPFS } from '@opendreamnet/ipfs'

export const ipfs = new IPFS({
  start: false,
  loadRefs: true
})