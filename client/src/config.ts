// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'shkkibkcq3'
export const apiEndpoint = `https://${apiId}.execute-api.us-west-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-nrc57dg31ixrlvym.us.auth0.com',            // Auth0 domain
  clientId: 'q7HyquDfCWd5r9ZgoyRmZDIdM7S6YT47',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
