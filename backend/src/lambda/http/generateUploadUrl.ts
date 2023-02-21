import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createLogger } from '../../utils/logging/logger'
import { getUserId } from '../auth/tokenUtils'
import { createImageAndPresignedUploadUrl } from '../../business/imageBusiness'

const logger = createLogger('GET upload-url')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const userId = getUserId(event)
    logger.info('userId', userId)

    const url = await createImageAndPresignedUploadUrl(userId)
    logger.info('url created')

    return {
      statusCode: 200,
      body: JSON.stringify({uploadUrl: url})
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
