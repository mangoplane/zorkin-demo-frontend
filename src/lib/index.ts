import Zorkin from 'zorkin-sdk'
import { googleClientId, DEMO_CLIENT_ID } from '../constants'

function base64ToBase64url(base64: string): string {
  return base64
    .replace(/\+/g, '-') // Replace '+' with '-'
    .replace(/\//g, '_') // Replace '/' with '_'
    .replace(/=+$/, '') // Remove any trailing '=' padding characters
}

function bufferToBase64url(buffer: Uint8Array | ArrayBuffer): string {
  return base64ToBase64url(Buffer.from(buffer).toString('base64'))
}

export const zorkin = new Zorkin({
  OAuthClients: {
    Google: {
      OAuthTokenBaseUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      ClientId: googleClientId
    }
  },
  clientID: bufferToBase64url(DEMO_CLIENT_ID),
})
