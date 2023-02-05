import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent } from 'aws-lambda/trigger/api-gateway-authorizer';
import { decode, Jwt, JwtPayload, verify } from 'jsonwebtoken';
import { createLogger } from '../../utils/logging/logger'
import * as JwksRsa from 'jwks-rsa'

const logger = createLogger('auth')

const jwksClient = JwksRsa({
  jwksUri: 'https://dev-nrc57dg31ixrlvym.us.auth0.com/.well-known/jwks.json',
});

export const handler = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => 
{
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  logger.info('Header kid', jwt.header.kid)
  const signedKey = await jwksClient.getSigningKey(jwt.header.kid)
  logger.info('Signed key', signedKey)

  return verify(token, signedKey.getPublicKey(), {
    algorithms: ["RS256"]
  }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
