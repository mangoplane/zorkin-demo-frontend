import Zorkin from 'zorkin-sdk'
import { googleClientId, DEMO_CLIENT_ID } from '../constants'

export const zorkin = new Zorkin({
  OAuthClients: {
    Google: {
      OAuthTokenBaseUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      ClientId: googleClientId
    }
  },
  clientID: DEMO_CLIENT_ID
})
