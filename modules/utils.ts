import { startsWith } from 'lodash'
import CryptoJS from 'crypto-js'
import mime from 'mime'
import { SEED_TEXT } from './defs'
import { Message } from '~/types'

/**
 * Requests the browser to download a blob as a file.
 *
 * @param blob
 * @param filename
 */
export function downloadBlob(blob: Blob, filename: string): void {
  // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
  const blobUrl = URL.createObjectURL(blob)

  // Create a link element
  const link = document.createElement('a')

  // Set link's href to point to the Blob URL
  link.href = blobUrl
  link.download = filename

  // Append link to the body
  document.body.appendChild(link)

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    })
  )

  // Remove link from body
  document.body.removeChild(link)
}

/**
 * Encrypts a message with the specified secret key.
 *
 * @param username
 * @param message
 * @param secretKey
 * @return Base64 encoded JSON with encrypted message format. (See [Message])
 */
export function encryptMessage(username: string, message: string, secretKey: string): string {
  const encrypt = CryptoJS.AES.encrypt(message, secretKey)

  const payload: Message = {
    username,
    message: encrypt.ciphertext.toString(), // Encrypted message
    iv: encrypt.iv.toString(),
    salt: encrypt.salt.toString(),
    seed: CryptoJS.HmacSHA512(SEED_TEXT, secretKey).toString() // Verification
  }

  return btoa(JSON.stringify(payload))
}

/**
 * Decrypts a Base64 string with an encrypted message.
 *
 * @param message
 * @param secretKey
 * @return
 */
export function decryptMessage(message: string, secretKey: string): Message | null {
  try {
    // Base64 string -> JSON
    const payload = JSON.parse(atob(message)) as Message

    if (!payload.seed || !payload.iv || !payload.salt) {
      // This message is invalid or has not been encrypted.
      // (This should not happen)
      return null
    }

    const hmac = CryptoJS.HmacSHA512(SEED_TEXT, secretKey).toString()

    if (hmac !== payload.seed) {
      // This user does not have the same encryption key.
      return null
    }

    const params = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Hex.parse(payload.message),
      iv: CryptoJS.enc.Hex.parse(payload.iv),
      salt: CryptoJS.enc.Hex.parse(payload.salt)
    })

    payload.content = CryptoJS.AES.decrypt(params, secretKey).toString(CryptoJS.enc.Utf8)

    return payload
  } catch (err: any) {
    // Developer is: sad :(
    console.warn('[decryptMessage]', err.message)
    return null
  }
}

type ObjectType = 'directory' | 'video' | 'audio' | 'image' | 'text' | 'pdf' | null

export function getObjectType(filename?: string | null): ObjectType {
  if (!filename) {
    return null
  }

  const mimetype = mime.getType(filename)

  if (!mimetype) {
    return 'directory'
  }

  if (startsWith(mimetype, 'video/')) {
    return 'video'
  }

  if (startsWith(mimetype, 'audio/')) {
    return 'audio'
  }

  if (startsWith(mimetype, 'image/')) {
    return 'image'
  }

  if (startsWith(mimetype, 'text/')) {
    return 'text'
  }

  if (mimetype === 'application/pdf') {
    return 'pdf'
  }

  return null
}