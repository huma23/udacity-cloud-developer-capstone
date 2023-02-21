
import middy from '@middy/core'
import cors from '@middy/http-cors'

import { createLogger } from '../../utils/logging/logger'
import { getUserId } from '../auth/tokenUtils'
import { getImages } from '../../business/imageBusiness'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

const logger = createLogger('GET transcripts')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const userId = getUserId(event)
    logger.info('userId', userId)

    const images = await getImages(userId)
    logger.info('found items', images.length)

    return {
      statusCode: 200,
      body: JSON.stringify({items: images})
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
