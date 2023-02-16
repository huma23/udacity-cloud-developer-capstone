
import * as uuid from 'uuid'

import { S3Event } from 'aws-lambda'
import { TranscribeClient, StartTranscriptionJobCommand, StartTranscriptionJobCommandOutput } from "@aws-sdk/client-transcribe"
import { createLogger } from '../../utils/logging/logger';

const logger = createLogger('CREATE transcript')

export const handler = async (event: S3Event): Promise<StartTranscriptionJobCommandOutput[]> => {
    
    const client = new TranscribeClient({region: 'us-west-1'});

    return Promise.all(event.Records.map((record) => {

        logger.info("Record", record)
        const mediaUri = process.env.AUDIOFILES_BASE_URL + record.s3.object.key
        logger.info(mediaUri)

        const input = {
            TranscriptionJobName: uuid.v4(),
            LanguageCode: "en-US",
            Media: {
                MediaFileUri: mediaUri
            }, 
            OutputBucketName: process.env.TRANSCRIPTS_S3_BUCKET
        };

        const command = new StartTranscriptionJobCommand(input);
        return client.send(command);
    }))
}
