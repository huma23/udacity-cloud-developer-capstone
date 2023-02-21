
import { createLogger } from '../../utils/logging/logger'
import { createPrediction } from '../../business/imageBusiness'
import { S3Event } from 'aws-lambda'

const logger = createLogger('CREATE prediction')

export const handler = async (event: S3Event): Promise<void[]> => {
    
  return await Promise.all(event.Records.map(async (record) => {
    logger.info("Record", record)
    const key = record.s3.object.key
    logger.info("Key", key)
    await createPrediction(key)
    logger.info("finished prediction")
  }))
}
