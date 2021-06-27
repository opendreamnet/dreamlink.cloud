import CryptoJS from 'crypto-js'
import { SEED_TEXT } from './defs'
import { Message } from '~/types'

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

export function encryptMessage(username: string, message: string, secretKey: string): string {
  const encrypt = CryptoJS.AES.encrypt(message, secretKey)

  const payload: Message = {
    username,
    message: encrypt.ciphertext.toString(),
    iv: encrypt.iv.toString(),
    salt: encrypt.salt.toString(),
    seed: CryptoJS.HmacSHA512(SEED_TEXT, secretKey).toString()
  }

  return btoa(JSON.stringify(payload))
}

export function decryptMessage(message: string, secretKey: string): Message | null {
  try {
    const payload = JSON.parse(atob(message)) as Message

    if (!payload.seed || !payload.iv || !payload.salt) {
      return null
    }

    const hmac = CryptoJS.HmacSHA512(SEED_TEXT, secretKey).toString()

    if (hmac !== payload.seed) {
      return null
    }

    const params = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Hex.parse(payload.message),
      iv: CryptoJS.enc.Hex.parse(payload.iv),
      salt: CryptoJS.enc.Hex.parse(payload.salt)
    })

    payload.content = CryptoJS.AES.decrypt(params, secretKey).toString(CryptoJS.enc.Utf8)

    return payload
  } catch (err) {
    console.warn('[decryptMessage]', err.message)
    return null
  }
}