/**
 * Maximum number of chat messages.
 */
export const MAX_RECORDS = 100

/**
 * Text that will be encrypted and then compared to verify that the active user has used the same encryption key.
 */
export const SEED_TEXT = 'banyan-choice-shrewish-oasis-albania'

/**
 * Maximum username length.
 */
export const MAX_USERNAME_LENGTH = 20

/**
 * Default encryption key in case the user does not set one.
 */
export const DEFAULT_ENCRYPTION_KEY = 'bR^x&)k4+fx=:3DLYLJ#FI'

/**
 * Gateways that do not support * CORS.
 */
export const GATEWAYS_CORS_BLOCKED = [
  'cf-ipfs.com',
  'overpi.com',
  'ipfs.fooock.com',
  'storjipfs-gateway.com',
  'ipfs.runfission.com',
  'trusti.id',
  'hashnews.k1ic.com',
  'ipfs.mihir.ch',
  'ipfs.globalupload.io',
  'ipfs.eternum.io',
  'bin.d0x.to',
  'drink.cafe',
  'ipfs.taxi'
]