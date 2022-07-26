let ipfsInstance: IPFS

export async function getIpfs(): Promise<IPFS> {
  if (ipfsInstance) {
    return ipfsInstance
  }

  ipfsInstance = new IPFS({
    start: false,
    loadRefs: true
  })

  return ipfsInstance
}