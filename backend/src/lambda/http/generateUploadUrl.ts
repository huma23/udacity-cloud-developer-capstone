import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createLogger } from '../../utils/logging/logger'
import { getUserId } from '../auth/tokenUtils'
import { createPresignedUploadUrl } from '../../business/transcriptBusiness'

const logger = createLogger('GET upload-url')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const transcriptId = event.pathParameters.transcriptId
    logger.info('transcriptId', transcriptId)
    const userId = getUserId(event)
    logger.info('userId', userId)

    const url = await createPresignedUploadUrl(transcriptId)
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
