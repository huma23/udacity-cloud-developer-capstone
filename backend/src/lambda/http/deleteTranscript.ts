import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createLogger } from '../../utils/logging/logger'
import { getUserId } from '../auth/tokenUtils'
import { deleteTodo } from '../../business/transcriptBusiness'


const logger = createLogger('DELETE transcript')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    const todoId = event.pathParameters.todoId
    logger.info('todoId', todoId)
    const userId = getUserId(event)
    logger.info('userId', userId)

    await deleteTodo(userId, todoId);
    logger.info('deleted', todoId)

    return {
      statusCode: 204,
      body: ''
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
