# Instructions for the Beta v2 testing program 

Beta v2 is the second stage of the Beta Testing program of Zorkin. Below are instructions to make use of the newly introduced Dashboard to setup your own Zorkin Client, and use it to authorize your own users to your site.

## Deploying your own client

To deploy your own client and associate with it supported OIDC Client Audience fields (OAuth Client IDs), please do the following:

### Create New Google Client

To create a new OAuth client for testing Zorkin:

1. Visit https://console.cloud.google.com/apis/credentials
2. Press the `Credential` button, and choose OAuth Client ID
3. Set application type to Web Application
4. Take note of clients Client ID (`GoogleClientID`)


### Make a new Zorkin Deployment with the Dashboard

To create a Zorkin deployment with the dashboard, associating it with the OAuth client ID:

1. Visit https://zorkin-dashboard.vercel.app/dashboard/deployment
2. Describe the client 
3. Add the OAuth client ID from the previous step with Google as the provider
4. Once created, visit the deployment again from the table at https://zorkin-dashboard.vercel.app/dashboard/deployment, and copy its Client ID (`ZorkinClientID`) field at the bottom

### Subscribe to Zorkin

If you haven't already, you must subscribe to Zorkin to use the service otherwise errors will be thrown when authorizing. You can do that as follows:

1. Visit https://zorkin-dashboard.vercel.app/dashboard/plan
2. Press the subscribe button
3. Proceed to subscribe by submitting the Stripe payment form. Since it's in testmode, you must use a Test Card Number which can be obtained from https://docs.stripe.com/testing


### Use the created Zorkin Client

To make use of the Zorkin client you created in the previous step, specify it along with your OAuth client to make a new instance of [Zorkin's Frontend SDK](https://www.npmjs.com/package/zorkin-sdk) as such:

```typescript
export const zorkin = new Zorkin({
  OAuthClients: {
    Google: {
      OAuthTokenBaseUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      ClientId: GoogleClientID
    }
  },
  clientID: ZorkinClientID
})
```

It's recommended you fork this repository and replace the client ID values in [constants.ts](./src/constants.ts) with your own and make use of the API following the example.